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
      type JS1 = { [k: string]: string | number | object }[];
      type JS2 = { errors: any };
      var json: JS1 = await response.json();
    } catch (error) {
      console.log('RESTApi request error happened', error);
      return {
        error: (error as Error).message,
      };
    }

    if (json === null) {
      return { error: 'Нет данных в ответе, проверьте заданные параметры' };
    }
    if ('errors' in json) {
      if (json?.errors) {
        return { error: 'Нет данных в ответе, проверьте заданные параметры' };
      }
    }

    if (realizationreport_id) {
      if (json instanceof Array) {
        json = json.filter((x) => {
          return (
            Number(x.realizationreport_id) === Number(realizationreport_id)
          );
        });
      }
    }

    // if (json.length === 0) {
    //   return Object.fromEntries(new Map());
    // }
    // console.log(1111, json);

    let ws = xlsx.utils.json_to_sheet(json || {});
    let wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sales data');
    xlsx.writeFile(wb, './data.xlsx');

    // await fs.writeFile('./data.xls', xls, () => {});

    const data = new Map();
    const nonSalesData: {}[] = [];

    json.forEach((item: { [k: string]: string | number | object }, i) => {
      // console.log(i, item.quantity, typeof item.quantity);
      if (!(item.doc_type_name === 'Продажа')) {
        console.log(`есть запись НЕ Продажа, а ${item.doc_type_name}`);
        nonSalesData.push(item);
        return false;
      }

      if (item.doc_type_name === 'Продажа') {
        // console.log(`все еще здесь записи, а ${item.doc_type_name}`);
        if (!data.has(item.sa_name)) {
          const obj: { [k: string]: string | number | object } = {};
          // console.log(item.sa_name);
          if (item.supplier_oper_name === 'Продажа') {
            obj.total_sell_quantity = Number(item.quantity) || 0;
            obj.total_sell_rub = Number(item.ppvz_for_pay) || 0;
            obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки и платной приемки`;
            obj.total_sell_before_commision =
              Number(item.retail_price_withdisc_rub) || 0;
            obj.total_delivery_rub = 0;
          }
          if (
            item.supplier_oper_name === 'Логистика' &&
            item.bonus_type_name === 'К клиенту при продаже'
          ) {
            obj.total_delivery_rub = Number(item.delivery_rub) || 0;
            obj.total_sell_quantity = Number(item.quantity) || 0;
            obj.total_sell_rub = Number(item.ppvz_for_pay) || 0;
            obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки и платной приемки`;
            obj.total_sell_before_commision =
              Number(item.retail_price_withdisc_rub) || 0;
          }
          if (item.supplier_oper_name === 'Оплата потерянного товара') {
            obj.total_sell_quantity = Number(item.quantity) || 0;
            obj.total_sell_rub = Number(item.ppvz_for_pay) || 0;
            obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки и платной приемки`;
            obj.total_sell_before_commision =
              Number(item.retail_price_withdisc_rub) || 0;
            obj.total_delivery_rub = Number(item.delivery_rub) || 0;
            obj.lost_items = Number(item.quantity) || 0;
          }
          data.set(item.sa_name, {
            ...obj,
            id: item.barcode,
            nm_id: item.nm_id.toString(),
            article: item.sa_name,
            name: item.subject_name,
            lost_items: obj.lost_items || 0,
            lost_items_description: `Потерянные товары по которым совершена операция Тип Оплата: Оплата потерянного товара. Это кол-во уже включено в общее поле quantity вместе с проданными товарами.`,
          });
        } else {
          const obj = data.get(item.sa_name);
          // console.log(
          //   item.quantity,
          //   typeof item.quantity,
          //   obj.total_sell_quantity,
          //   typeof obj.total_sell_quantity,
          // );
          // if (isNaN(obj.total_sell_quantity)) {
          //   console.log(11, obj, item);
          //   console.log(11, json[i - 1]);
          // }

          if (item.supplier_oper_name === 'Продажа') {
            obj.total_sell_quantity += Number(item.quantity);

            obj.total_sell_rub += Number(item.ppvz_for_pay);
            obj.total_sell_before_commision += Number(
              item.retail_price_withdisc_rub,
            );
          }
          if (
            item.supplier_oper_name === 'Логистика' &&
            item.bonus_type_name === 'К клиенту при продаже'
          ) {
            obj.total_delivery_rub += Number(item.delivery_rub);
          }
          if (item.supplier_oper_name === 'Оплата потерянного товара') {
            obj.total_sell_quantity += Number(item.quantity) || 0;
            obj.total_sell_rub += Number(item.ppvz_for_pay) || 0;
            obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки и платной приемки`;
            obj.total_sell_before_commision +=
              Number(item.retail_price_withdisc_rub) || 0;
            obj.total_delivery_rub = +Number(item.delivery_rub) || 0;
            obj.lost_items += Number(item.quantity) || 0;
          }

          data.set(item.sa_name, {
            ...obj,
            id: item.sa_name,
            name: item.subject_name,
            article: item.sa_name,
            lost_items: obj.lost_items || 0,
            lost_items_description: `Потерянные товары по которым совершена операция Тип Оплата: Оплата потерянного товара. Это кол-во уже включено в общее поле quantity вместе с проданными товарами.`,
          });
        }
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
          Cookie: `BasketUID=${process.env.BasketUID};  x-supplier-id-external=${process.env.xSupplierIdExternal}; x-supplier-id=${process.env.xSupplierId}; WILDAUTHNEW_V3=${process.env.WILDAUTHNEW_V3}`,
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
