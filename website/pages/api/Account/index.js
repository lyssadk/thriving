import { sql } from '@vercel/postgres';
 
export default async function handler(req, res) {
    const data = await sql`SELECT * FROM users`;
    console.log(res.json(data));
}

// export default async function handler(req, res) {
//   switch (req.method) {
//     case 'GET':
//       try {
//         // Fetch all accounts from the database
//         const accounts = await db('accounts').select('*');
//         res.status(200).json(accounts); // Return the accounts as a response
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch accounts' }); // Error handling
//       }
//       break;
    
//     case 'POST':
//       try {
//         const { username, email, password } = req.body; // Expecting fields in the request body
//         if (!username || !email || !password) {
//           return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Insert the new account into the database
//         const newAccount = await db('accounts').insert({
//           username,
//           email,
//           password, // In a real-world app, make sure to hash the password before storing it!
//         }).returning('*');

//         res.status(201).json(newAccount[0]); // Respond with the newly created account
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to create account' }); // Error handling
//       }
//       break;
    
//     default:
//       res.status(405).json({ error: 'Method Not Allowed' }); // For unsupported methods
//       break;
//   }
// }
