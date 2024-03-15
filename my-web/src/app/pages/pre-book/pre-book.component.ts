import { Component, OnDestroy, OnInit } from '@angular/core';
import { crudService } from '../../../services/crud.service';
import { timeService } from '../../../services/time.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pre-book.component.html',
  styleUrl: './pre-book.component.css'
})

export class PreBookComponent implements OnInit, OnDestroy {
  khach_lst: any = []; sdt_lst: any = []; infoKH: any; san_status: any = [];
  soSan: number = 5; VIP: boolean = false; status: string = "new";
  infoForm: any; selected!: number; currentTab: string = "all";
  lichAM$: any = []; lichPM$: any = []; lich$: any = []; lichAll$: any = [];
  subscript: any; id!: string; checkBtn: boolean = false; checkDiff: boolean = true;

  constructor(private _service: crudService, private _time: timeService, private fb: FormBuilder, private router: Router) {
    this.infoForm = this.fb.group({
      nguoiDat: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required]
    });

    this._service.getCollection('khach').then(docs => {
      this.khach_lst = docs;
      this.khach_lst.forEach((khach: any) => {
        this.sdt_lst.push(khach.sdt);
      });
    });
  }

  ngOnInit(): void {
    this.getdb("all");
    this.lich$ = this.lichAll$;

    this._service.getCollection("san").then(san =>
      san.forEach((s: any) => { this.san_status.push(s.trangThai) }));

    this.subscript = this._service.changeListener.subscribe(change => {
      if (change != null && change.component == "booking") {
        this.getdb(this.currentTab);
        this._service.clearChange(); 
      }
    });
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }

  getdb(tab: string) {
    let arr: any; let AM: any; let PM: any;
    this.lichAll$ = []; this.lichAM$ = []; this.lichPM$ = []; this.lich$ = [];

    this.san_status = [];
    this._service.getCollection("san").then(san =>
      san.forEach((s: any) => { this.san_status.push(s.trangThai) }));
    console.log("test");
    for (let i = 1; i <= this.soSan; i++) {
      this._service.findInCollection("datTruoc", "san", "==", i.toString()).then(docs => {
        arr = this._time.sortTime(docs);
        console.log(arr, i);
        this.lichAll$.push(arr);

        AM = []; PM = [];
        arr.forEach((doc: any) => {
          if (doc.time == "am")
            AM.push(doc);
          else PM.push(doc);
        })
        this.lichAM$.push(AM); this.lichPM$.push(PM);
      });
    }

    this.getCurrentDB(tab);
  }

  getCurrentDB(tg: string) {
    if (tg == "am")
      this.lich$ = this.lichAM$;
    else if (tg == "pm")
      this.lich$ = this.lichPM$;
    else if (tg == "all") 
      this.lich$ = this.lichAll$;

    this.currentTab = tg;
  }

  getName(sdt: string) {
    let khach = this.khach_lst.find((khach: any) => khach.sdt === sdt);
    if (khach != undefined) {
      this.infoForm.get("nguoiDat").setValue(khach.ten);
      if (khach.hang == "VIP") this.VIP = true;
    }
    else this.infoForm.get("nguoiDat").setValue("");

    this.valid();
  }

  rsForm() {
    this.infoForm.reset();
    this.VIP = false;
    this.checkDiff = true;
  }

  newBooking(idx: number) {
    this.selected = idx; 
    this.status = 'new';
    this.rsForm();
  }

  saveBooking() {
    let info: any;
    if (this.infoForm.valid) {
      info = {
        san: this.selected?.toString(),
        ten: this.infoForm.get("nguoiDat").value,
        sdt: this.infoForm.get("sdt").value,
        checkIn: this.infoForm.get("checkIn").value,
        checkOut: this.infoForm.get("checkOut").value,
        time: parseInt(this.infoForm.get("checkIn").value.split(':')[0]) < 12 ? 'am' : 'pm',
      }

      this._service.createDocument('datTruoc', info, undefined, "booking");
      this.rsForm();
    }
  }

  detailBooking(info: any) {
    this.id = info.id; this.status = "update"; this.selected = info.san;
    let khach = this.khach_lst.find((khach: any) => khach.sdt === info.sdt);
    if (khach != undefined && khach.hang == "VIP") this.VIP = true;
    this.checkBtn = false;
    console.log(this.id);
    this.infoForm.setValue({
      nguoiDat: info.ten,
      sdt: info.sdt,
      checkIn: info.checkIn,
      checkOut: info.checkOut,
    })
  }

  cancelBooking() {
    this._service.deleteDocument("datTruoc", this.id, "booking");
  }

  valid() {
    if (this.infoForm.valid)
      if (this._time.getTimeDiff(this.infoForm.get("checkOut").value, this.infoForm.get("checkIn").value) >= 1){
        this.checkBtn = true;
        this.checkDiff = true;
      }
      else {
        this.checkBtn = false;
        this.checkDiff = false;
      }
    else this.checkBtn = false;
  }

  updateBooking() {
    let data = {
      ten: this.infoForm.get("nguoiDat").value,
      sdt: this.infoForm.get("sdt").value,
      checkIn: this.infoForm.get("checkIn").value,
      checkOut: this.infoForm.get("checkOut").value,
      time: parseInt(this.infoForm.get("checkIn").value.split(':')[0]) < 12 ? 'am' : 'pm',
    }

    this._service.updateDocument("datTruoc", this.id, data, "booking");
    this.rsForm();
  }

  checkIn() {
    let info = {
      chiTiet: {
        VIP: this.VIP,
        nguoiDat: this.infoForm.get("nguoiDat").value,
        sdt: this.infoForm.get("sdt").value,
        checkIn: this.infoForm.get("checkIn").value,
        checkOut: this.infoForm.get("checkOut").value,
      },
      trangThai: "Đang hoạt động"
    }
    this._service.updateDocument("san", this.selected.toString(), info, "");
    this._service.deleteDocument("datTruoc", this.id, "booking");
    this.router.navigate(["trang-chu"]);
  };
}
