import { getSession } from 'next-auth/react';
import { sql } from '@vercel/postgres';

const companyMap = {  
  2: 'CellCore',
  1: 'Just Ingredients',
  3: 'ClearStem'
}
  

async function fetchEmailsFromGmail(accessToken) {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();
  console.log('Fetch Emails From Gmail function data ------------------->',data);
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
  const orderNumber = data.snippet.match(/Order #(\d+)/);
  console.log('Order Number:', data.snippet);
  console.log('Fetch Email Details function data ------------------->',data);
  return data;
}

async function parseEmailContent(email) {
  const parts = email.payload.parts[0].parts;
  let emailContent = '';
  console.log('Parse Email Content function data 2 ------------------->',parts[0].parts);
  // console.log('Parse Email Content function data 3 ------------------->',parts[0].parts[0]);
  // Loop through the email parts and find the text/plain or text/html content
  parts.forEach(part => {
    if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
      const decodedBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
      emailContent += decodedBody;
    }
  });
  console.log('Email Content:', emailContent);

  return emailContent;
}

async function extractReceiptData(emailContent) {
  // Use regular expressions or simple parsing logic to extract receipt details from email content
  let vendor = emailContent.match(/From: (.*)/g)?.[1]?.split(' ')[1] || ''
  let date
  let amount
  let orderNumber
  let shipping
  let products = []
  const productRegex = /(.+?) × (\d+)/g;
  const priceRegex = /\$([\d.]+)/;
  const wholesaleRegex = /Wholesale/;

  let match;
  while ((match = productRegex.exec(emailContent)) !== null) {
    const nameOne = match[1].trim();
    const name = nameOne.replace(/\[.*?\]/g, '').trim();

    const quantity = parseInt(match[2], 10);
    const priceMatch = priceRegex.exec(emailContent);
    const price = priceMatch ? parseFloat(priceMatch[1]) / quantity : 0;
    const wholesale = wholesaleRegex.test(emailContent);

    products.push({
      name,
      quantity,
      price,
      wholesale,
    });
  }

  if(vendor === 'CellCore'){
    const dateString = emailContent.match(/Sent: (.*)/g)?.[1]?.split('Sent: ')[1] || '';
    date = new Date(dateString);
    amount = emailContent.match(/Total\s*\$([\d.]+)\s*USD/)?.[1] || '';
    orderNumber = emailContent.match(/Subject: Order #(\w+)/)?.[1] || '';
    shipping = emailContent.match(/Shipping\s*\$([\d.]+)/)?.[1] || '';
  }
  const receiptData = {
    orderDate: date,
    total: amount,
    company: Object.keys(companyMap).find(key => companyMap[key] === vendor),
    orderNumber: orderNumber,
    shipping: shipping,
    products: products,
  };

  return receiptData;
}



export default async function handler(req, res) {
  const accessToken = req.body.accessToken;
  
  // if (!session || !session.user.accessToken) {
  //   return res.status(401).json({ error: 'User not authenticated' });
  // }

  try {
    // Fetch email list
    const emailList = await fetchEmailsFromGmail(accessToken);
    let receiptDataList = [];
    // Process each email message
    for (const email of emailList) {
      const emailDetails = await fetchEmailDetails(email.id, accessToken);
      const emailContent = await parseEmailContent(emailDetails);
      const receiptData = await extractReceiptData(emailContent);
      receiptDataList.push(receiptData);

      // return the receipt data
    }

    return res.status(200).json(receiptDataList);
  } catch (error) {
    console.error('Error scraping emails:', error);
    return res.status(500).json({ error: 'Error processing emails' });
  }
}
