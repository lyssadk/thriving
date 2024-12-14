import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { year } = req.query; // Get year from query string

  try {
    const result = await sql`
      SELECT 
          EXTRACT(MONTH FROM date) AS month,
          SUM(gross_sales) AS total_gross_sales
      FROM 
          transactions
      WHERE 
          EXTRACT(YEAR FROM date) = ${year}
      GROUP BY 
          EXTRACT(MONTH FROM date)
      ORDER BY 
          month;
    `;

    const data = result.rows.map(row => ({
      month: row.month,
      total_gross_sales: row.total_gross_sales,
    }));
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
}
