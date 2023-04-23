// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: { [k: string]: string | number };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const data = {};
  const srid = (req.query.srid as unknown as number) || 0;
  const startDate = '2023-02-01';
  const endDate = '2023-04-23';
  const apiToken =
    (req.query.api_token as unknown as string) ||
    (process.env.WB_TOKEN as unknown as string);
  res.status(200).json({ data });
}
