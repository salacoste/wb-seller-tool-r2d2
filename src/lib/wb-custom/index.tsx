import fs from 'fs';
import { start } from 'repl';
import xlsx, { read, writeFileXLSX } from 'xlsx';

export type IData = {
  data?: {
    [k: string]: any;
  };
  error?: boolean;
  errorText?: string;
  additionalErrors?: null | {} | string;
  message?: any;
};

export interface IWbModel {
  getReport: (
    apiToken: string,
    startDate: string,
    endDate: string,
    limit: number,
    srid?: number,
    realizationreport_id?: number | string,
  ) => {};
  getAcceptance: (
    apiToken: string,
    startDate: string,
    endDate: string,
  ) => Promise<IData>;
}

export const WbModelReport: IWbModel = {
  getReport: async (
    apiToken: string,
    startDate: string,
    endDate: string,
    srid = 0,
    limit: number = 10000,
    realizationreport_id?,
    ...props
  ) => {
    srid = srid || 0;
    const url = `https://statistics-api.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${startDate}&limit=${limit}&dateTo=${endDate}&rrdid=${srid}`;

    try {
      let response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      var json: {}[] = await response.json();
    } catch (error) {
      console.log('RESTApi request error happened', error);
      return {
        error: (error as Error).message,
      };
    }

    if (json === null) {
      return { error: 'Нет данных в ответе, проверьте заданные параметры' };
    }
    if (realizationreport_id) {
      json = json.filter((x: { [k: string]: string }) => {
        return Number(x.realizationreport_id) === Number(realizationreport_id);
      });
    }

    // if (json.length === 0) {
    //   return Object.fromEntries(new Map());
    // }
    let ws = xlsx.utils.json_to_sheet(json || {});
    let wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sales data');
    xlsx.writeFile(wb, './data.xlsx');

    // await fs.writeFile('./data.xls', xls, () => {});

    const data = new Map();
    const nonSalesData: {}[] = [];
    // console.log(json);
    json.forEach((item: { [k: string]: string | number }, i) => {
      if (!(item.doc_type_name === 'Продажа')) {
        console.log(`есть запись НЕ Продажа, а ${item.doc_type_name}`);
        nonSalesData.push(item);
        return false;
      }

      if (!data.has(item.sa_name)) {
        const obj: { [k: string]: string | number } = {};
        // console.log(item.sa_name);
        if (item.supplier_oper_name === 'Продажа') {
          obj.total_sell_quantity = item.quantity || 0;
          obj.total_sell_rub = item.ppvz_for_pay || 0;
          obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки и приемки`;
          obj.total_sell_before_commision = item.retail_price_withdisc_rub || 0;
          obj.total_delivery_rub = 0;
        }
        if (
          item.supplier_oper_name === 'Логистика' &&
          item.bonus_type_name === 'К клиенту при продаже'
        ) {
          obj.total_delivery_rub = item.delivery_rub || 0;
          obj.total_sell_quantity = item.quantity || 0;
          obj.total_sell_rub = item.ppvz_for_pay || 0;
          obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки и приемки`;
          obj.total_sell_before_commision = item.retail_price_withdisc_rub || 0;
        }
        data.set(item.sa_name, {
          ...obj,
          id: item.barcode,
          nm_id: item.nm_id.toString(),
          article: item.sa_name,
          name: item.subject_name,
        });
      } else {
        const obj = data.get(item.sa_name);
        if (item.supplier_oper_name === 'Продажа') {
          obj.total_sell_quantity += item.quantity;
          obj.total_sell_rub += item.ppvz_for_pay;
          obj.total_sell_before_commision += item.retail_price_withdisc_rub;
        }
        if (
          item.supplier_oper_name === 'Логистика' &&
          item.bonus_type_name === 'К клиенту при продаже'
        ) {
          obj.total_delivery_rub += Number(item.delivery_rub);
        }
        data.set(item.sa_name, {
          ...obj,
          id: item.sa_name,
          name: item.subject_name,
          article: item.sa_name,
        });
      }
    });

    if (nonSalesData.length > 0) {
      let ws2 = xlsx.utils.json_to_sheet(nonSalesData);
      let wb2 = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb2, ws2, 'Non Sales data');
      xlsx.writeFile(wb2, './data_nonsales.xlsx');
    }

    let result = Object.fromEntries(data);

    const data2: string[] = startDate.split('-');
    const data3: string[] = endDate.split('-');
    const updatedStartDate = ''.concat(
      data2[2],
      '.',
      data2[1],
      '.',
      data2[0].slice(2),
    );
    const updatedEndDate = ''.concat(
      data3[2],
      '.',
      data3[1],
      '.',
      data3[0].slice(2),
    );

    const fetch2 = `${process.env.URL}/api/acceptance?startDate=${updatedStartDate}&endData=${updatedEndDate}`;
    try {
      const t = await fetch(fetch2, {});
      var json2: { data: { [k: string]: { sum: number; count: number } } } =
        await t.json();
      //   console.log(333, json, result);
    } catch (error) {
      console.log(`RESTApi request error happened on url ${fetch2}`, error);
      return {
        error: (error as Error).message,
      };
    }

    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const element = result[key];
        // console.log('ll', element, json2, json2?.data[element.nm_id]);
        if (json2?.data[element.nm_id]) {
          element.acceptance_rub = json2?.data[element.nm_id].sum;
          element.acceptance_count = json2?.data[element.nm_id].count;
          element.acceptance_per_unit =
            element.acceptance_rub / element.acceptance_count;
          element.acceptance_description = `Стоимость услуг приемке товара в указанный период по данному артикулу товара`;
        } else {
          element.acceptance_rub = 0;
          element.acceptance_count = 0;
          element.acceptance_per_unit = 0;
          element.acceptance_description = `Стоимость услуг приемке товара в указанный период по данному артикулу товара`;
        }
        for (const key2 in element) {
          if (Object.prototype.hasOwnProperty.call(element, key2)) {
            let element2 = element[key2];
            if (typeof element2 === 'number') {
              element[key2] = element2.toFixed(2);
              //   console.log(element[key2]);
            }
          }
        }
      }
    }

    return await result;
  },
  getAcceptance: async (
    apiToken: string,
    startDate: string,
    endDate: string,
  ): Promise<IData> => {
    const url = `https://seller.wildberries.ru/ns/acceptance/analytics-back/api/v1/acceptance?dateFrom=${startDate}&dateTo=${endDate}`;
    let data = {};
    try {
      let response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          Cookie: `BasketUID=69624370-f602-4084-abdc-6275b0c2b7a7;  x-supplier-id-external=87935c94-cb5b-4f17-a1fc-809ac83aaa7e; x-supplier-id=87935c94-cb5b-4f17-a1fc-809ac83aaa7e; WILDAUTHNEW_V3=9098AFF9C8EB1984A8389C474735F194D8ADE7AA8660B9069C5B6803C7B96155E862E49CA122AE38CF34D6EDD4EED095B3D28B57B139ED6E9CC9B5635E9D325FF8E5904E438B435A619DFE2C9D8C2B4F01C0FFB087495F06D775A082EE7CA17DE33F0775B6A30DC127D70E479DCA9ECDF1C8570A0E9AEC12388230B137396CD59EF4A3E5A7F2DD2251DD04DCA923482401828D2D27E9931309FA7857DD81125385FD87B2013DB167141FD7990C715A1F225749C8B4159E304FC7304BBE12ECA13F6F3FFD615F30C2ACFA40B421DBD207A715B7B5A48EEFBBA6D2D04DFD61254715EB53B25202A59F4E9CC0582C70906EA8C6818233F0698E2020F403944E0E66AB1CED68FAAA33DAC9E14520E6888F55E0B0CB4DE2C2CA9349B18816874DE477C49F0CF1575C5708584664229AE49FB26F8D0B4E; WBToken=AviegAvO-NfCDM7G4eAMQnDH5IH5DjK6IZjdriU0whFDbC0LA22dx6eMG2HpQAU7NePkmwdSVjfpkVkGNchAd2QlmQhXLJVyHPOmLJOXAGcAXg;`,
        },
      });
      var json: IData = await response.json();
      return json;
    } catch (error: unknown) {
      return {
        data: {},
        error: true,
        message: error,
      };
    }
  },
};

export default WbModelReport;