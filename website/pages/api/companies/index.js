// pages/api/companies.js
import { query } from "../../../lib/db"; // Import the database module

export default async function handler(req, res) {
  try {
    // Fetch the list of companies from the database using the query function
    console.log('trying to fetch companies');
    const companies = await query('SELECT * FROM companies WHERE company_name = $1', [company_name]); // SQL query to fetch companies
    res.status(200).json(companies); // Return the companies as JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
}
