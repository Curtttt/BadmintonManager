import { Component } from '@angular/core';
import { crudService } from '../../../services/crud.service';
import { timeService } from '../../../services/time.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doanh-thu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doanh-thu.component.html',
  styleUrl: './doanh-thu.component.css'
})

export class DoanhThuComponent {
  today: string; currentTab: string = "Sân"; totalRevenue = 0;
  san$: any; dichVu$: any; tienMat$: any; chuyenKhoan$: any;
  currentRev: any; tabLst: any = []; dbLst: any = [];
  loading = true;

  constructor(private _service: crudService, private _time: timeService) {
    this.today = _time.getCurrentDay();
    this.tabLst = ["Sân", "Dịch vụ", "Ăn uống"];

    this.tabLst.forEach((tab: any) => {
      _service.findInCollection("doanhthuNgay", "danhMuc", "==", tab).then(docs => {
        this.dbLst.push(docs);
        this.totalRevenue += this.calcRevenue(docs);
        if (tab == "Sân") this.currentRev = docs;
        setTimeout(() => this.loading = false, 200);
        
      });
    });

    _service.findInCollection("doanhthuNgay", "hinhthucTT", "==", "Tiền mặt").then(docs => { this.tienMat$ = docs; });
    _service.findInCollection("doanhthuNgay", "hinhthucTT", "==", "Chuyển khoản").then(docs => { this.chuyenKhoan$ = docs; });
  }

  calcRevenue(lst: any) {
    let tong = 0;
    lst?.forEach((doc: any) => { tong += doc.soTien });
    return tong;
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    let idx = this.tabLst.indexOf(tab);
    this.currentRev = this.dbLst[idx];
  }
}
