import { getSession } from 'next-auth/react';
import { query } from '@vercel/postgres';

async function fetchEmailsFromGmail(accessToken) {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();
  
  if (data.messages) {
    return data.messages; // List of message IDs
  }
  return [];
}

async function fetchEmailDetails(emailId, accessToken) {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  return data;
}

async function parseEmailContent(email) {
  const parts = email.payload.parts;
  let emailContent = '';

  // Loop through the email parts and find the text/plain or text/html content
  parts.forEach(part => {
    if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
      const decodedBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
      emailContent += decodedBody;
    }
  });

  return emailContent;
}

async function extractReceiptData(emailContent) {
  // Use regular expressions or simple parsing logic to extract receipt details from email content
  const receiptData = {
    date: emailContent.match(/Date: (.*)/)?.[1] || '',
    amount: emailContent.match(/Total: \$(\d+\.\d{2})/)?.[1] || '',
    vendor: emailContent.match(/From: (.*)/)?.[1] || '',
  };

  return receiptData;
}

async function storeReceiptData(receiptData) {
  const { date, amount, vendor } = receiptData;

  // Insert receipt data into PostgreSQL database
  const res = await query(`
    INSERT INTO receipts (date, amount, vendor)
    VALUES ($1, $2, $3) RETURNING id`, 
    [date, amount, vendor]);

  return res.rows[0].id;
}

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session || !session.user.accessToken) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Fetch email list
    const emailList = await fetchEmailsFromGmail(session.user.accessToken);

    // Process each email message
    for (const email of emailList) {
      const emailDetails = await fetchEmailDetails(email.id, session.user.accessToken);
      const emailContent = await parseEmailContent(emailDetails);
      const receiptData = await extractReceiptData(emailContent);

      // Store parsed receipt data in the database
      const receiptId = await storeReceiptData(receiptData);
      console.log(`Receipt saved with ID: ${receiptId}`);
    }

    return res.status(200).json({ message: 'Emails processed successfully' });
  } catch (error) {
    console.error('Error scraping emails:', error);
    return res.status(500).json({ error: 'Error processing emails' });
  }
}
