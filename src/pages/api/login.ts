import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Perform username/password validation here
    // This is a placeholder, replace with actual validation logic
    if (username === 'admin' && password === 'admin') {
      // Generate JWT token
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

      // Set the token in an HTTP-only cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/;`);
      return res.status(200).json({ success: true, username });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
