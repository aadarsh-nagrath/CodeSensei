import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Define your custom JWT payload type
interface CustomJwtPayload extends JwtPayload {
  username?: string; // Optional if you're not sure it will always be present
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  try {
    // Decode and cast the token payload to your custom type
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;

    // Check if the decoded object contains 'username'
    if (decoded.username) {
      return res.status(200).json({ username: decoded.username });
    } else {
      return res.status(400).json({ message: 'Username not found in token' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
