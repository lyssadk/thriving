// pages/api/receipts/index.js
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
 
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
                const { orderNumber, company, products, salesTax, total, state, orderDate, shipping } = req.body; // Expecting fields in the request body
                if (!orderNumber  || !company || !products || !total  || !orderDate) {
                    console.log(req.body)
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                console.log(req.body)

                // Insert the new receipt into the database
                const newReceipt = await sql`
                    INSERT INTO receipts (ordernumber, company, products, salestax, total, state, orderdate, shipping)
                    VALUES (${orderNumber}, ${company}, ${JSON.stringify(products)}, ${salesTax}, ${total}, ${state}, ${orderDate}, ${shipping})
                    RETURNING *;
                `;

                res.status(201).json(newReceipt[0]); // Respond with the newly created receipt
                alert('Receipt created successfully');
            } catch (error) {
                res.status(500).json({ error: 'Failed to create receipt' }); // Error handling
            }
            break;
        case 'PUT':
            try {
                const { orderNumber, company, products, salesTax, total, state, orderDate } = req.body;
                if (!orderNumber  || !company || !products || !salesTax || !total || !state || !orderDate) {
                    console.log(req.body)
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const updatedReceipt = await sql`
                    UPDATE receipts
                    SET ordernumber = ${orderNumber}, company = ${company}, products = ${JSON.stringify(products)}, salesTax = ${salesTax}, total = ${total}, state = ${state}, orderDate = ${orderDate}
                    WHERE ordernumber = ${orderNumber}
                    RETURNING *;
                `;

                res.status(200).json(updatedReceipt[0]);
            } catch (error) {
                console.log(error)
                res.status(500).json({ error: 'Failed to update receipt' });
            }
            break;
        case 'DELETE':
            try {
                const { orderNumber } = req.body;
                if (!orderNumber) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                await sql`
                    DELETE FROM receipts
                    WHERE ordernumber = ${orderNumber};
                `;

                res.status(200).json({ message: 'Receipt deleted successfully' });
                alert('Receipt deleted successfully');
                redirect('/receipts');
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete receipt' });
            }
            break;
        default:
            res.status(405).json({ error: 'Method Not Allowed' }); // For unsupported methods
            break;
    }
}