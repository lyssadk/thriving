// pages/api/receipts/index.js
import { sql } from '@vercel/postgres';
 
// export default async function data(req, res) {
//     const data = await sql`SELECT * FROM receipts`;
//     console.log(res.json(data));
// }

// import { db } from '../../lib/db'; // Database connection

// export default async function handler(req, res) {
//   switch (req.method) {
//     case 'GET':
//       try {
//         // Fetch all receipts from the database
//         const receipts = await db('receipts').select('*');
//         res.status(200).json(receipts); // Send the list of receipts as a response
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch receipts' }); // Error handling
//       }
//       break;
    
//     case 'POST':
//       try {
//         const { amount, date, description } = req.body; // Expecting fields in the request body
//         if (!amount || !date || !description) {
//           return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Insert the new receipt into the database
//         const newReceipt = await db('receipts').insert({
//           amount,
//           date,
//           description,
//         }).returning('*');

//         res.status(201).json(newReceipt[0]); // Respond with the newly created receipt
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to create receipt' }); // Error handling
//       }
//       break;
    
//     default:
//       res.status(405).json({ error: 'Method Not Allowed' }); // For unsupported methods
//       break;
//   }
// }
export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                // Fetch all receipts from the database
                const receipts = await sql`SELECT * FROM receipts`;
                res.status(200).json(receipts); // Return the receipts as a response
            } catch (error) {
                console.log(error)
                res.status(500).json({ error: 'Failed to fetch receipts' }); // Error handling
            }
            break;
        
        case 'POST':
            try {
                const { orderNumber, company, products, salesTax, total, state, orderDate } = req.body; // Expecting fields in the request body
                if (!orderNumber  || !company || !products || !salesTax || !total || !state || !orderDate) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Insert the new receipt into the database
                const newReceipt = await sql`
                    INSERT INTO receipts (ordernumber, company, products, salestax, total, state, orderdate)
                    VALUES (${orderNumber}, ${company}, ${JSON.stringify(products)}, ${salesTax}, ${total}, ${state}, ${orderDate})
                    RETURNING *;
                `;

                res.status(201).json(newReceipt[0]); // Respond with the newly created receipt
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Failed to create receipt' }); // Error handling
            }
            break;
        case 'PUT':
            try {
                const { id, orderNumber, company, products, salesTax, total, state, orderDate } = req.body;
                if (!id || !orderNumber  || !company || !products || !salesTax || !total || !state || !orderDate) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const updatedReceipt = await sql`
                    UPDATE receipts
                    SET orderNumber = ${orderNumber}, company = ${company}, products = ${products}, salesTax = ${salesTax}, total = ${total}, state = ${state}, orderDate = ${orderDate}
                    WHERE id = ${id}
                    RETURNING *;
                `;

                res.status(200).json(updatedReceipt[0]);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update receipt' });
            }
            break;
        case 'DELETE':
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                await sql`
                    DELETE FROM receipts
                    WHERE id = ${id};
                `;

                res.status(200).json({ message: 'Receipt deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete receipt' });
            }
            break;
        default:
            res.status(405).json({ error: 'Method Not Allowed' }); // For unsupported methods
            break;
    }
}