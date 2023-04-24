// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { WbModelReport } from '@/lib/wb-custom/index';
import { IData } from '@/lib/wb-custom/index';

type Data = {
  data: IData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let data: IData;
  const srid = (req.query.srid as unknown as number) || 0;
  const startDate = req.query.startDate || '02.02.23';
  const endDate = req.query.endDate || '20.04.23';
  const apiToken =
    (req.query.api_token as unknown as string) ||
    (process.env.WB_TOKEN as unknown as string);

  data = await WbModelReport.getAcceptance(
    apiToken,
    startDate as unknown as string,
    endDate as unknown as string,
  );

  if (!data.error) {
    // console.log('00', data);

    var response: Map<string, { [k: string]: any }> = new Map();

    if (data?.data?.shks) {
      data.data.shks.forEach((el: { [k: string]: any }, i: number) => {
        el.gis.forEach((e: { subjects: [] }, i: number) => {
          // console.log(11, e);
          e.subjects.forEach((r: { nms: [] }, i: number) => {
            r.nms.forEach(
              (
                element: { nmId: number; count: number; sum: number },
                i: number,
              ) => {
                // console.log(22, element);
                const obj = response.get(`${element.nmId}`);
                if (obj) {
                  response.set(`${element.nmId}`, {
                    nmId: element.nmId,
                    count: Number(element.count + obj.count),
                    sum: Number(element.sum + obj.sum),
                  });
                } else {
                  response.set(`${element.nmId}`, element);
                }
              },
            );
          });
        });
      });
    }
    var result = Object.fromEntries(response);
    res.status(200).json({ data: result });
  } else {
    var r = {
      error: true,
      data: {},
    };
    res.status(200).json({ data: r });
  }
}
