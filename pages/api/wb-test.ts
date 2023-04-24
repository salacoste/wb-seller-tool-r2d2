// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { WbModelReport } from '@/lib/wb-custom/index';
import xlsx, { read, writeFileXLSX } from 'xlsx';

type Data = {
  data: { [k: string]: string | number };
  totalData: { [k: string]: string | number };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const srid = (req.query.srid as unknown as number) || 0;
  const startDate = '2023-01-01';
  const endDate = '2023-04-24';
  const apiToken =
    (req.query.api_token as unknown as string) ||
    (process.env.WB_TOKEN as unknown as string);
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

  if (response.error || response.errors) {
    res.status(200).json(response);
    return;
  }

  let clear_sales_over_period: number = 0;
  let delivery_over_period: number = 0;
  let total_lost_items_over_period: number = 0;

  let sales_with_commision_over_period: number = 0;
  let total_quantity_over_period: number = 0;
  let the_most_clear_money_over_period: number = 0;
  let average_commision_percent_over_period: number = 0;
  let _item_numbers_over_period: number = 0;

  Object.keys(response).forEach((key: any) => {
    let item = response[key];

    item.commision_percents = (
      (1 -
        (item.total_sell_rub - item.total_delivery_rub) /
          item.total_sell_before_commision) *
      100
    ).toFixed(2);
    item.the_most_clear_money = (
      item.total_sell_rub -
      item.total_delivery_rub -
      item.acceptance_rub
    ).toFixed(2);
    item.the_most_clear_money_description = `Рубли с вычетом всех комиссий WB, доставок к покупатели, возвратов, платной приемки (пока без учета оплат возвратов - когда забирает с ПВЗ, а потом возвращает в течении 14 дней)`;

    _item_numbers_over_period += 1;
    clear_sales_over_period += Number(item.total_sell_rub);
    total_lost_items_over_period += Number(item.lost_items);
    sales_with_commision_over_period += Number(
      item.total_sell_before_commision,
    );
    total_quantity_over_period += Number(item.total_sell_quantity);
    delivery_over_period += Number(item.total_delivery_rub);
    the_most_clear_money_over_period += Number(item.the_most_clear_money);
    average_commision_percent_over_period += Number(item.commision_percents);
  });

  if (typeof response === 'object') {
    const r = [];
    for (const key in response) {
      if (Object.prototype.hasOwnProperty.call(response, key)) {
        const element = response[key];
        r.push(element);
      }
    }
    let ws2 = xlsx.utils.json_to_sheet(r);
    let wb2 = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb2, ws2, 'Summary Report');
    xlsx.writeFile(wb2, './data_wb_test.xlsx');
  }

  res.status(200).json({
    data: response,
    totalData: {
      total_quantity_over_period,
      total_lost_items_over_period: total_lost_items_over_period.toFixed(0),
      the_most_clear_money_over_period:
        the_most_clear_money_over_period.toFixed(2),
      clear_sales_over_period: clear_sales_over_period.toFixed(2),
      sales_with_commision_over_period:
        sales_with_commision_over_period.toFixed(2),
      delivery_over_period: delivery_over_period.toFixed(2),
      average_commision_percent_over_period: (
        average_commision_percent_over_period / _item_numbers_over_period
      ).toFixed(2),
    },
  });
}
