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
  infoForm: any; billForm: any; VIP: boolean = false;
  khach_lst: any; sdt_lst: any = [];
  payment: string = "Tiền mặt"; checkBtn: boolean = false; checkDiff: boolean = true;

  constructor(private fb: FormBuilder, private firestore: Firestore, private _service: crudService, public _time: timeService) {
    this.infoForm = this.fb.group({
      nguoiDat: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]],
      checkIn: '',
      checkOut: ''
    });

    this.billForm = this.fb.group({
      total: { value: '', disabled: true },
      payment: "Tiền mặt"
    })

    _service.getCollection('khach').then(docs => {
      this.khach_lst = docs;
      this.khach_lst.forEach((khach: any) => {
        this.sdt_lst.push(khach.sdt);
      });
    });

    this.subscript = _service.currentInfo.subscribe(KH => {
      this.infoKH = KH;
      if (KH != undefined) {
        this.infoForm.setValue({
          nguoiDat: this.infoKH.nguoiDat,
          sdt: this.infoKH.sdt,
          checkIn: this.infoKH.checkIn,
          checkOut: this.infoKH.checkOut
        })

        if (KH.hasOwnProperty("tongTien")) {
          this.billForm.get("total").setValue(KH.tongTien.toLocaleString('vi-VN'));
        }
      }
      else {
        this.infoForm.setValue({
          nguoiDat: '',
          sdt: '',
          checkIn: this._time.getCurrentTime(),
          checkOut: ''
        })
      }
    })
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }

  getName(sdt: string) {
    let khach = this.khach_lst.find((khach: any) => khach.sdt === sdt);
    if (khach != undefined) {
      this.infoForm.get("nguoiDat").setValue(khach.ten);
      if (khach.hang == "VIP") this.VIP = true;
      else this.VIP = false;
    }
    else {
      this.infoForm.get("nguoiDat").setValue("");
      this.VIP = false;
    }
  }

  cleanForm() {
    this.infoForm.reset();
    this.VIP = false;
    this.checkDiff = true;
  }

  xacNhan(mode: string) {
    let detail = this.infoForm.getRawValue();
    detail["VIP"] = this.VIP;

    let data = {
      chiTiet: detail,
      trangThai: "Đang hoạt động",
    }

    if (mode == "new") {
      this._service.updateDocument("san", this.maSan, data, "san");
      this.cleanForm();
    }
    else if (mode == "edit")
      this._service.updateDocument("san", this.maSan, data, "san");
  }

  valid() {
    if (this.infoForm.valid)
      if (this.infoForm.get("checkOut").value != "")
        if (this._time.getTimeDiff(this.infoForm.get("checkOut").value, this.infoForm.get("checkIn").value) >= 1) {
          this.checkBtn = true;
          this.checkDiff = true;
        }
        else {
          this.checkBtn = false;
          this.checkDiff = false;
        }
      else {
        this.checkBtn = true;
        this.checkDiff = true;
      }
    else {
      this.checkBtn = false;
    }
  }

  editTT() { this.billForm.get("total").enable(); }

  newTT(event: any) { 
    let editedMoney = parseInt(this.billForm.get("total").value) * 1000;
    this.billForm.get("total").setValue(editedMoney.toLocaleString("vi-VN"));
    this.billForm.get("total").disable(); 
  }

  saveBill(id_: string) {
    let info: any;

    info = {
      san: id_,
      ten: this.infoKH.nguoiDat,
      sdt: this.infoKH.sdt,
      checkIn: this.infoKH.checkIn,
      sogioThue: this.infoKH.sogioThue,
      soTien: parseInt(this.billForm.get("total").value) * 1000,
      hinhthucTT: this.billForm.get("payment").value,
      danhMuc: "Sân"
    }
    this._service.createDocument('doanhthuNgay', info);

    if (this.sdt_lst.includes(this.infoKH.sdt)) {
      let khachhang: any;
      this._service.findInCollection("khach", "sdt", "==", this.infoKH.sdt).then(doc => {
        khachhang = doc[0];
        info = {
          gioThue: khachhang.gioThue + parseInt(this.infoKH.sogioThue),
          tongTien: parseInt(this.billForm.get("total").value) * 1000 + khachhang.tongTien
        }
        this._service.updateDocument("khach", khachhang.id, info, "khach");
      });
    }

    info = {
      activeHours: parseFloat(this.infoKH.sogioThue).toFixed(1) + this.infoKH.activeHours,
      chiTiet: { nguoiDat: '', sdt: '', checkIn: '', checkOut: ''},
      trangThai: 'Sẵn sàng'
    }
    this._service.updateDocument("san", id_, info, "san");
  }
}