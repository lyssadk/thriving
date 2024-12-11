import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const { year } = req.query; // Get year from query string

    try {
        const result = await sql`
            SELECT 
            SUM(gross_sales) AS total_gross_sales,
            SUM(total_collected) AS total_year_collected,
            SUM(tax) AS total_tax
            FROM 
            transactions
            WHERE 
            EXTRACT(YEAR FROM date) = ${year};
        `;

        const data = result.rows.map(row => ({
            total_gross_sales: row.total_gross_sales,
            total_collected: row.total_year_collected,
            total_tax: row.total_tax,
        }));
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sales data' });
    }
}