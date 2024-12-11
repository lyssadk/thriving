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
                const { name, price, company_id, image, quantity } = req.body; // Expecting fields in the request body
                if (!name || !price || !company_id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Insert the new product into the database
                const newProduct = await sql`
                    INSERT INTO products (name, price, company_id, image, quantity)
                    VALUES (${name}, ${price}, ${company_id}, ${image}, ${quantity})
                    RETURNING *;
                `;

                res.status(201).json(newProduct[0]); // Respond with the newly created product
            } catch (error) {
                res.status(500).json({ error: 'Failed to create product' }); // Error handling
            }
            break;
        case 'PUT':
            try {
                const { id, name, price, company_id, image, quantity } = req.body;
                if (!id || !name || !price || !company_id) {
                    console.log(req.body);
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const updatedProduct = await sql`
                    UPDATE products
                    SET name = ${name}, price = ${price}, company_id = ${company_id}, image = ${image}, quantity = ${quantity}
                    WHERE id = ${id}
                    RETURNING *;
                `;

                res.status(200).json(updatedProduct[0]);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update product' });
            }
            break;
        case 'DELETE':
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                await sql`
                    DELETE FROM products
                    WHERE id = ${id};
                `;

                res.status(200).json({ message: 'Product deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete product' });
            }
            break;
    }
}
