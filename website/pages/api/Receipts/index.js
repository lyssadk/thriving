// pages/api/receipts/index.js

import { db } from '../../lib/db'; // Database connection

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        // Fetch all receipts from the database
        const receipts = await db('receipts').select('*');
        res.status(200).json(receipts); // Send the list of receipts as a response
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch receipts' }); // Error handling
      }
      break;
    
    case 'POST':
      try {
        const { amount, date, description } = req.body; // Expecting fields in the request body
        if (!amount || !date || !description) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert the new receipt into the database
        const newReceipt = await db('receipts').insert({
          amount,
          date,
          description,
        }).returning('*');

        res.status(201).json(newReceipt[0]); // Respond with the newly created receipt
      } catch (error) {
        res.status(500).json({ error: 'Failed to create receipt' }); // Error handling
      }
      break;
    
    default:
      res.status(405).json({ error: 'Method Not Allowed' }); // For unsupported methods
      break;
  }
}
