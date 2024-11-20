// pages/api/companies.js

import { db } from '../../../lib/db'; // Assuming you have a database connection

export default async function handler(req, res) {
  try {
    // Fetch the list of companies from the database
    console.log('trying to fetch companies');
    const companies = await db('companies').select('id', 'company_name');
    res.status(200).json(companies); // Return the companies as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
}
