import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, vertical } = req.body;

  if (!email || !vertical) {
    return res.status(400).json({ error: 'Brakuje email lub vertical' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Nieprawidłowy email' });
  }

  try {
    await pool.query(
      'INSERT INTO waitlist (email, vertical) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [email.toLowerCase().trim(), vertical]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Błąd serwera' });
  }
}
