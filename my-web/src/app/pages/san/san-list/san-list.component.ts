import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { crudService } from '../../../../services/crud.service';
import { SanDetailComponent } from '../san-detail/san-detail.component';
import { Subscription } from 'rxjs';
import { timeService } from '../../../../services/time.service';

@Component({
  selector: 'app-san-list',
  standalone: true,
  imports: [CommonModule, SanDetailComponent],
  templateUrl: './san-list.component.html',
  styleUrl: './san-list.component.css'
})

export class SanListComponent implements OnDestroy {
  sans$: any; infoKH?: any = { nguoiDat: '', sdt: '', checkIn: '' };
  data!: any; selected: string = ""; state?: string; subscript!: Subscription;
  loading: boolean = true;


  constructor(private _service: crudService, private _time: timeService) {
    _service.getCollection("san").then(docs => { this.sans$ = docs; this.loading = false; console.log(this.sans$) });
    this.subscript = this._service.changeListener.subscribe(change => {
      if (change != null && change.component == "san") {
        _service.getCollection("san").then(docs => { this.sans$ = docs; this.loading = false; console.log(this.sans$) });
        // this.sans$[parseInt(change.target.id) - 1] = change.target;
        this._service.clearChange();
      }
    })
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }

  datSan(id: string) {
    this.selected = id;
    this.state = "Đặt ngay";
    this._service.sendInfo(null);
  }

  bill(id_: string) {
    let dongiaSan = 70000; let dongiaVot = 20000;
    this.selected = id_;
    let data = this.sans$.find((doc: any) => doc.id == id_);
    let hoursUsed = this._time.getTimeDiff(this._time.getCurrentTime(), data.chiTiet.checkIn);

    let san = (hoursUsed * dongiaSan);

    this._service.sendInfo({ ...data.chiTiet, ...{ activeHours: data.activeHours }, ...{ sogioThue: hoursUsed }, ...{ tongTien: san } });
    this.state = "Thanh toán";
  }

  huySan(id: string) {
    let data = {
      chiTiet: { nguoiDat: '', sdt: '', checkIn: '', checkOut: '' },
      trangThai: 'Sẵn sàng'
    }
    this._service.updateDocument('san', id, data, "san");
  }

  edit(id_: string, status: string) {
    this.selected = id_;
    this.state = "Chỉnh sửa";
    let target = this.sans$.find((doc: any) => doc.id == id_);
    this._service.sendInfo({ ...target.chiTiet, ...{ trangThai: target.trangThai }, ...{ component: "san" } });
  }
} 
