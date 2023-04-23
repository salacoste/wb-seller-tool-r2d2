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
          obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки`;
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
          obj.total_sell_rub_description = `Сумма с учетом комиссий WB, но без учета расхода на доставки`;
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
      xlsx.writeFile(wb, './data_nonsales.xlsx');
    }

    let result = Object.fromEntries(data);

    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const element = result[key];
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
};

export default WbModelReport;
