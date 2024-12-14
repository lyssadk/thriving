import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const { year } = req.query; // Get year from query string

    try {
        const result = await sql`
        SELECT 
            SUM(shipping) AS total_shipping_cost
        FROM 
            receipts
        WHERE 
            EXTRACT(YEAR FROM orderdate) = ${year}
        `;
        console.log(result.rows);
        const data = result.rows.map(row => ({
            total_shipping_cost: row.total_shipping_cost,
        }));
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch shipping data' });
    }
}
