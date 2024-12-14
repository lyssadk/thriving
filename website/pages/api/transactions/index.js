import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                // Fetch all transactions from the database
                const transactions = await sql`SELECT * FROM transactions`;
                res.status(200).json(transactions); // Return the transactions as a response
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch transactions' }); // Error handling
            }
            break;
        
        case 'POST':
            try {
                const { date, gross_sales, tax, total_collected, transaction_id } = req.body; // Expecting fields in the request body
                if (!date || !gross_sales || !tax || !total_collected || !transaction_id) {
                    console.log(req.body);
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Insert the new transaction into the database
                const newTransaction = await sql`
                    INSERT INTO transactions (date, gross_sales, tax, total_collected, transaction_id)
                    VALUES (${date}, ${parseFloat(gross_sales)}, ${parseFloat(tax)}, ${parseFloat(total_collected)}, ${transaction_id})
                    RETURNING *;
                `;
                
                res.status(201).json('Created Transaction', newTransaction); // Respond with the newly created transaction
            } catch (error) {
                res.status(500).json({ error: 'Failed to create transaction' }); // Error handling
            }
            break;
        case 'PUT':
            try {
                const { date, gross_sales, tax, total_collected, transaction_id } = req.body;
                if (!transaction_id || !date || !gross_sales || !tax || !total_collected) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const updatedTransaction = await sql`
                    UPDATE transactions
                    SET date = ${date}, gross_sales = ${gross_sales}, tax = ${tax}, total_collected = ${total_collected}
                    WHERE transaction_id = ${transaction_id}
                    RETURNING *;
                `;

                res.status(200).json(updatedTransaction[0]);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update transaction' });
            }
            break;
        case 'DELETE':
            try {
                const { transaction_id } = req.body;
                if (!transaction_id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                await sql`
                    DELETE FROM transactions
                    WHERE transaction_id = ${transaction_id};
                `;

                res.status(200).json({ message: 'Transaction deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete transaction' });
            }
            break;
    }
}