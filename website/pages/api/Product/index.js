// pages/api/products/index.js
import { sql } from '@vercel/postgres';
 
export default async function data(req, res) {
    const data = await sql`SELECT * FROM products`;
    console.log(res.json(data));
}

// import { db } from '../../lib/db'; // Database connection

// export default async function handler(req, res) {
//   switch (req.method) {
//     case 'GET':
//       try {
//         // Fetch all products from the database
//         const products = await db('products').select('*');
//         res.status(200).json(products); // Return the products as a response
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch products' }); // Error handling
//       }
//       break;
    
//     case 'POST':
//       try {
//         const { name, price, description } = req.body; // Expecting fields in the request body
//         if (!name || !price || !description) {
//           return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Insert the new product into the database
//         const newProduct = await db('products').insert({
//           name,
//           price,
//           description,
//         }).returning('*');

//         res.status(201).json(newProduct[0]); // Respond with the newly created product
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to create product' }); // Error handling
//       }
//       break;
    
//     default:
//       res.status(405).json({ error: 'Method Not Allowed' }); // For unsupported methods
//       break;
//   }
// }
