import { Component, OnDestroy, OnInit } from '@angular/core';
import { crudService } from '../../../services/crud.service';
import { timeService } from '../../../services/time.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pre-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pre-book.component.html',
  styleUrl: './pre-book.component.css'
})

export class PreBookComponent implements OnInit, OnDestroy {
  khach_lst: any = []; sdt_lst: any = [];
  soSan = 5; infoKH: any;
  infoForm: any; selected?: number; currentTab: string = "all";
  lichAM$: any = []; lichPM$: any = []; lich$: any = []; lichAll$: any = [];
  subscript: any;

  constructor(private _service: crudService, private _time: timeService, private fb: FormBuilder) {
    this.infoForm = this.fb.group({
      nguoiDat: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]],
      checkIn: '',
      checkOut: ''
    });

    this.getdb();
    this.lich$ = this.lichAll$;

    this._service.getCollection('khach').then(docs => {
      this.khach_lst = docs;
      this.khach_lst.forEach((khach: any) => {
        this.sdt_lst.push(khach.sdt);
      });
    });
  }

  ngOnInit(): void {
    this.subscript = this._service.changeListener.subscribe(change => {
      if (change != null && change.component == "booking") {
        this.getdb(); console.log("ye");
        this.getCurrentDB(this.currentTab);
        this._service.clearChange();
      }
    });
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }

  getdb() {
    let arr: any; let AM: any; let PM: any;
    this.lichAll$ = []; this.lichAM$ = []; this.lichPM$ = [];
    for (let i = 1; i <= this.soSan; i++) {
      this._service.findInCollection("datTruoc", "san", "==", i.toString()).then(docs => {
        arr = this._time.sortTime(docs);
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
  }

  getCurrentDB(tg?: string) {
    if (tg != undefined) this.currentTab = tg;
    if (tg == "am")
      this.lich$ = this.lichAM$;
    else if (tg == "pm")
      this.lich$ = this.lichPM$;
    else this.lich$ = this.lichAll$;
  }

  getName(sdt: string) {
    let khach = this.khach_lst.find((khach: any) => khach.sdt === sdt);
    if (khach != undefined)
      this.infoForm.get("nguoiDat").setValue(khach.ten);
    else this.infoForm.get("nguoiDat").setValue("");
  }

  newBooking(idx: number) {
    this.selected = idx + 1;
    this.infoForm.reset();
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
        time: parseInt(this.infoForm.get("checkIn").value.split(':')[0]) < 12 ? 'am' : 'pm'
      }
      this._service.createDocument('datTruoc', info, undefined, "booking");
    }
  }

  getInfo(info: any) {
    this.infoForm.setValue({
      nguoiDat: info.ten,
      sdt: info.sdt,
      checkIn: info.checkIn,
      checkOut: info.checkOut
    })
  }
}
