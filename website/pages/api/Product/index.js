// pages/api/products/index.js
import { sql } from '@vercel/postgres';


export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                // Fetch all products from the database
                const products = await sql`SELECT * FROM products`;
                res.status(200).json(products); // Return the products as a response
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch products' }); // Error handling
            }
            break;
        
        case 'POST':
            try {
                const { name, price, company_id } = req.body; // Expecting fields in the request body
                if (!name || !price || !company_id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Insert the new product into the database
                const newProduct = await sql`
                    INSERT INTO products (name, price, company_id)
                    VALUES (${name}, ${price}, ${company_id})
                    RETURNING *;
                `;

                res.status(201).json(newProduct[0]); // Respond with the newly created product
            } catch (error) {
                res.status(500).json({ error: 'Failed to create product' }); // Error handling
            }
            break;
        
        case 'PUT':
            try {
                const { id, name, price, company_id } = req.body; // Expecting fields in the request body
                if (!id || !name || !price || !company_id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Update the product in the database
                const updatedProduct = await sql`
                    UPDATE products
                    SET name = ${name}, price = ${price}, company_id = ${company_id}
                    WHERE id = ${id}
                    RETURNING *;
                `;

                res.status(200).json(updatedProduct[0]); // Respond with the updated product
            } catch (error) {
                res.status(500).json({ error: 'Failed to update product' }); // Error handling
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.body; // Expecting fields in the request body
                if (!id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Delete the product from the database
                const deletedProduct = await sql`
                    DELETE FROM products
                    WHERE id = ${id}
                    RETURNING *;
                `;

                res.status(200).json(deletedProduct[0]); // Respond with the deleted product
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete product' }); // Error handling
            }
            break;
        
        default:
            res.status(405).json({ error: 'Method Not Allowed' }); // For unsupported methods
            break;
    }
}
