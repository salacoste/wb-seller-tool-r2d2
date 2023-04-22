// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { WbModelReport } from '@/lib/wb-custom/index';

type Data = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const srid = (req.query.srid as unknown as number) || 0;
  const startDate = '2023-04-01';
  const endDate = '2023-04-22';
  const apiToken =
    (req.query.api_token as unknown as string) ||
    ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NJRCI6IjdlM2I5MjY5LWMyMGYtNDQ4OS1iZDYzLTYyMmUzZjkwMjRlYSJ9.pI_wUJqCg7sNYZh-EWV_sK7SLcqsLTvvGTM9-zFSbQ8' as unknown as string);
  const realizationreport_id = req.query
    .realizationreport_id as unknown as number;
  const response: any = await WbModelReport.getReport(
    apiToken,
    startDate,
    endDate,
    srid,
    (req.query.limit as unknown as number) || 10000,
    realizationreport_id,
  );

  Object.keys(response).forEach((key: any) => {
    let item = response[key];
    item.commision_percents =
      (1 -
        (item.total_sell_rub - item.total_delivery_rub) /
          item.total_sell_before_commision) *
      100;
  });
  res.status(200).json({ data: response });
}
