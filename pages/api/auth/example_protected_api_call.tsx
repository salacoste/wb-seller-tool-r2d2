import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function Auth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  return res.json({
    message: 'Success',
  });
}
