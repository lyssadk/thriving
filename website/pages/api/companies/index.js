// pages/api/companies.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const companies = await sql`SELECT * FROM companies`;
                res.status(200).json(companies);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch companies' });
            }
            break;

        case 'POST':
            try {
                const { company_name } = req.body;
                if (!company_name) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const newCompany = await sql`
                    INSERT INTO companies (company_name)
                    VALUES (${company_name})
                    RETURNING *;
                `;

                res.status(201).json(newCompany[0]);
            } catch (error) {
                res.status(500).json({ error: 'Failed to create company' });
            }
            break;

        case 'PUT':
            try {
                const { id, name } = req.body;
                if (!id || !name) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const updatedCompany = await sql`
                    UPDATE companies
                    SET name = ${name}
                    WHERE id = ${id}
                    RETURNING *;
                `;

                res.status(200).json(updatedCompany[0]);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update company' });
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const deletedCompany = await sql`
                    DELETE FROM companies
                    WHERE id = ${id}
                    RETURNING *;
                `;

                res.status(200).json(deletedCompany[0]);
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete company' });
            }
            break;

        default:
            res.status(405).json({ error: 'Method Not Allowed' });
            break;
    }
}
