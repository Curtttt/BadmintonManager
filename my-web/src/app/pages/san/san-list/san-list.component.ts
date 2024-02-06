import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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

export class SanListComponent implements OnDestroy, OnInit {
  sans$: any; infoKH?: any = { nguoiDat: '', sdt: '', checkIn: '' };
  data!: any; selected: string = ""; state?: string; subscript!: Subscription;


  constructor(private _service: crudService, private _time: timeService) {}

  ngOnInit(): void {
    this._service.getCollection("san").then(docs => { this.sans$ = docs; });
    this.subscript = this._service.editListener.subscribe(change => {
      if (change != null) {
        this.sans$[(parseInt(change.id) - 1).toString()] = change;
        const idx = this.sans$.findIndex((item: any) => item.id == change.id);
        this.sans$[idx] = change;
      }
    })
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }

  datSan(id: string) {
    this.selected = id;
    this.state = "Đặt ngay";
    this._service.editInfo(undefined);
  }

  bill(id_: string) {
    let dongiaSan = 70000; let dongiaVot = 20000;
    this.selected = id_;
    let data = this.sans$.find((doc: any) => doc.id == id_);
    let hoursUsed = this._time.getTimeDiff(this._time.getCurrentTime(), data.chiTiet.checkIn);

    let san = (hoursUsed * dongiaSan);
    let vot = (data.chiTiet.thueVot * dongiaVot);
    
    this._service.editInfo({...data.chiTiet, ...{activeHours: data.activeHours}, ...{sogioThue: hoursUsed}, ...{tongTien: [san, vot, san + vot]}});
    this.state = "Thanh toán";
  }

  huySan(id: string) {
    let data = {
      chiTiet: { nguoiDat: '', sdt: '', checkIn: '' },
      trangThai: 'Sẵn sàng'
    }
    this._service.updateDocument('san', this.selected, data);
  }

  edit(id_: string, status: string) {
    this.selected = id_;
    this.state = "Chỉnh sửa";
    let target = this.sans$.find((doc: any) => doc.id == id_);
    this._service.editInfo({...target.chiTiet, ...{trangThai: target.trangThai}});
  }
} 
