import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { crudService } from '../../../../services/crud.service';
import { SanBookComponent } from '../san-detail/san-book/san-book.component';
import { SanEditComponent } from '../san-detail/san-edit/san-edit.component';
import { SanPrebookComponent } from '../san-detail/san-prebook/san-prebook.component';

@Component({
  selector: 'app-san-list',
  standalone: true,
  imports: [CommonModule, SanBookComponent, SanEditComponent, SanPrebookComponent],
  templateUrl: './san-list.component.html',
  styleUrl: './san-list.component.css'
})

export class SanListComponent implements OnDestroy{
  sans$: any; editData: any = ""; data!: any; subscript: Subscription;
  selected: string = ""; edit_ = false; state?: string;

  constructor(private _service: crudService) {
    this.subscript = _service.getCollection('san').subscribe(docs => this.sans$ = docs);
  }

  ngOnDestroy(): void {
    this.subscript.unsubscribe();
  }
  
  datSan(id: string) { 
    this.selected = id; 
    this.state = "Đặt ngay";
  }
  
  edit(id: string) {
    this.selected = id;
    this.state = "Chỉnh sửa";
    this.sans$.filter((doc: any) => this.editData = doc.chiTiet);
  }
  
  thanhToan(id_: number) {
    this.data = this.sans$.find((doc: any) => doc.id == id_);
    let hoursUsed = Date.now() - this.data.chiTiet.checkIn.toDate();
    // console.log(((hoursUsed / 3600000) * 70000).toLocaleString("vi-VN"));
    // console.log((hoursUsed / 3600000));
  }

  huyDat(){
    let data = {
      chiTiet: { nguoiDat: '', sdt: '', checkIn: '' },
      trangThai: 'Sẵn sàng',
    }
    this._service.updateDocument('san', this.selected, data)
  }
} 
