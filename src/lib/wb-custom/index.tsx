import fs from 'fs';
import xlsx, { read, writeFileXLSX } from 'xlsx';

export interface IWbModel {
  getReport: (
    apiToken: string,
    startDate: string,
    endDate: string,
    limit: number,
    srid?: number,
    realizationreport_id?: number | string,
  ) => {};
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
      console.log(error);
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
    // console.log(json);
    json.forEach((item: { [k: string]: string | number }, i) => {
      if (!(item.doc_type_name === 'Продажа')) {
        console.log(`есть запись НЕ Продажа, а ${item.doc_type_name}`);
        return false;
      }

      if (!data.has(item.sa_name)) {
        const obj: { [k: string]: string | number } = {};
        // console.log(item.sa_name);
        if (item.supplier_oper_name === 'Продажа') {
          obj.total_sell_quantity = item.quantity || 0;
          obj.total_sell_rub = item.ppvz_for_pay || 0;
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
          obj.total_sell_before_commision = item.retail_price_withdisc_rub || 0;
        }
        data.set(item.sa_name, {
          ...obj,
          id: item.barcode,
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
          //   console.log(222, obj.total_delivery_rub);
        }
        data.set(item.sa_name, {
          ...obj,
          id: item.sa_name,
          name: item.subject_name,
          article: item.sa_name,
        });
      }
    });

    return await Object.fromEntries(data);
  },
};

export default WbModelReport;
