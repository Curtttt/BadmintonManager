import { Component, Input, OnDestroy } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { crudService } from '../../../../services/crud.service';
import { Subscription } from 'rxjs';
import { timeService } from '../../../../services/time.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-san-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './san-detail.component.html',
  styleUrl: './san-detail.component.css'
})

export class SanDetailComponent implements OnDestroy {
  @Input() maSan: string = "";
  @Input() state?: string;
  infoKH: any; subscript: Subscription;
  infoForm: any; billForm: any;
  khach_lst: any; sdt_lst: any = [];
  payment: string = "Tiền mặt";
  mark_txt: boolean = false; disabledInp: boolean = true;

  constructor(private fb: FormBuilder, private firestore: Firestore, private _service: crudService, private _time: timeService) {
    this.infoForm = this.fb.group({
      nguoiDat: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]],
      checkIn: '',
      thueVot: false,
      slVot: 0
    });

    this.billForm = this.fb.group({
      total: { value: '', disabled: true },
      payment: "Tiền mặt"
    })

    this._service.getCollection('user').then(docs => {
      this.khach_lst = docs;
      this.khach_lst.forEach((khach: any) => {
        this.sdt_lst.push(khach.SDT);
      });
    });

    this.subscript = _service.currentInfo.subscribe(KH => {
      this.infoKH = KH;
      if (KH != undefined ) {
        this.infoForm.setValue({
          nguoiDat: this.infoKH.nguoiDat,
          sdt: this.infoKH.sdt,
          checkIn: this.infoKH.checkIn,
          thueVot: this.infoKH.thueVot > 0 ? true : false,
          slVot: this.infoKH.thueVot
        })
        this.infoKH.thueVot > 0 ? this.infoForm.get('slVot').enable() : this.infoForm.get('slVot').disable();

        if (KH.hasOwnProperty("tongTien")) 
          this.billForm.get("total").setValue(KH.tongTien[2].toLocaleString('vi-VN'));
      }
      else {
        this.infoForm.setValue({
          nguoiDat: '',
          sdt: '',
          checkIn: this._time.getCurrentTime(),
          thueVot: false,
          slVot: 0
        })
        this.infoForm.get('slVot').disable();
      }
    })
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }

  getName(sdt: string) {
    let khach = this.khach_lst.find((khach: any) => khach.SDT === sdt);
    if (khach != undefined)
      this.infoForm.get("nguoiDat").setValue(khach.TenKH);
  }

  cleanForm() { this.infoForm.reset(); }

  xacNhan(mode: string) {
    if (this.infoForm.get('nguoiDat').valid && this.infoForm.get('sdt').valid) {
      let detail = this.infoForm.getRawValue();
      detail["thueVot"] = detail.slVot;
      delete detail.slVot;

      let data = {
        chiTiet: detail,
        trangThai: "Đang hoạt động",
      }
      this._service.updateDocument('san', this.maSan, data);
      if (mode == "new")
        this.cleanForm();
    }
  }

  checkVot(flag: boolean) {
    if (!flag) {
      this.infoForm.get('slVot').disable();
      this.infoForm.get('slVot').setValue(0);
    }
    else this.infoForm.get('slVot').enable();
  }

  editTT() {
    this.billForm.get("total").enable();
  }

  newTT(event: any) {
    this.mark_txt = true;
    this.billForm.get("total").disable();
  }

  rsTT() {
    this.mark_txt = false;
  }

  saveBill(id_: string) {
    let bill = {
      san: id_,
      ten: this.infoKH.nguoiDat,
      sdt: this.infoKH.sdt,
      checkin: this.infoKH.checkIn,
      sogioThue: this.infoKH.sogioThue,
      thanhToan: this.billForm.get("payment").value,
      soTien: parseInt(this.billForm.get("total").value) * 1000
    }
    this._service.createDocument('doanhthuNgay', bill);

    let info = {
      activeHours: parseFloat(this.infoKH.sogioThue) + this.infoKH.activeHours,
      chiTiet: { nguoiDat: '', sdt: '', checkIn: '' },
      trangThai: 'Sẵn sàng'
    }
    this._service.updateDocument('san', id_, info);
  }
}