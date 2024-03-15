import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  extractData(lst: any){
    let kq: any = [];

    lst.forEach((row: any) => {
      kq.push([row.ten, row.sdt, row.san, row.checkIn, row.sogioThue, row.soTien]);
    })

    return kq;
  }

  exportExcel(excelData: { title: any; data: any; }) {
    const title = excelData.title;
    const header = ['Họ tên', 'SĐT', 'Sân', 'Giờ vào', 'Số giờ thuê', 'Số tiền'];
    const data = excelData.data;

    let wb = new Workbook();
    let ws_cash = wb.addWorksheet('Tiền mặt');
    let ws_bank = wb.addWorksheet('Chuyển khoản');

    ws_cash.addRow(header);
    ws_bank.addRow(header);
    
    ws_cash.addRows(data['Tiền mặt']);
    ws_bank.addRows(data['Chuyển khoản']);

    wb.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}
