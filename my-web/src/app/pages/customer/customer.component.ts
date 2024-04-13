import { Component, OnDestroy, OnInit } from '@angular/core';
import { crudService } from '../../../services/crud.service';
import { timeService } from '../../../services/time.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit, OnDestroy {
  kh$: any; selected!: string; subscript!: Subscription;
  infoForm: any; dkiForm: any; idx?: number = 0;
  loading = true; renew = false; validEdit = true

  constructor(private _service: crudService, private _time: timeService, private fb: FormBuilder) {
    this.infoForm = fb.group({
      ten: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]],
      ngayDK: { value: '', disabled: true },
      ngayVIP: {value: '', disabled: true},
      gioThue: { value: '', disabled: true },
      tongTien: { value: '', disabled: true },
      hang: '',
      giaHan: ''
    })

    this.dkiForm = fb.group({
      ten: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]]
    });
  }
  
  ngOnInit(): void {
    this._service.getCollection("khach").then(docs => { this.kh$ = docs; this.loading = false});
    this.subscript = this._service.changeListener.subscribe(change => {
      if (change != null){
        this.loading = true;

        if (change.component == "khach-new"){
          this.kh$ = change.target;
          setTimeout(()=> this.loading = false, 800);
        }
        else if (change.component == "khach-edit" || change.component == "khach-del")
          this._service.getCollection("khach").then(docs => { this.kh$ = docs; this.loading = false});

        this._service.clearChange(); 
      }
    });  
  }

  getDetail(id_: string, idx: number) {
    this.selected = id_; this.idx = idx;
    let doc = this.kh$.find((kh: any) => kh.id == id_)

    doc.hang == "VIP" ? this.renew = true : this.renew = false;
    
    this.infoForm.setValue({
      ten: doc.ten,
      sdt: doc.sdt,
      ngayDK: doc.ngayDK,
      ngayVIP:doc.ngayVIP,
      gioThue: `${doc.gioThue} h`,
      tongTien: doc.tongTien.toLocaleString("vi-VN") + " vnđ",
      hang: doc.hang,
      giaHan: doc.ngayVIP
    })
  }

  checkValid(){
    console.log(this._time.getDayDiff(this.infoForm.get('ngayDK').value, this._time.getDay(this.infoForm.get('giaHan').value)));
    console.log(this.infoForm.get('ngayDK').value, this._time.getDay(this.infoForm.get('giaHan').value));
    if (this.infoForm.invalid)
      this.validEdit = this.checkRenew();
    else this.validEdit = false;
  }
  
  checkRenew(){
      if (this.infoForm.get('giaHan').value == "" || this._time.getDayDiff(this.infoForm.get('ngayDK').value, this._time.getDay(this.infoForm.get('giaHan').value)) >= 30)
        return true;
      else return false;
  }

  func(mode: string) {
    if (mode == "new") {
      let data = {
        ten: this.dkiForm.get('ten').value,
        sdt: this.dkiForm.get('sdt').value,
        ngayDK: this._time.getDay("today"),
        ngayVIP: "",
        gioThue: 0,
        tongTien: 0,
        hang: "Thường"
      }
      this._service.createDocument("khach", data, undefined, "khach-new");
      this.dkiForm.reset();
    }
    else if (mode == 'edit') {

      let data = {
        ten: this.infoForm.get('ten').value,
        sdt: this.infoForm.get('sdt').value,
        hang: this.infoForm.get('hang').value,
        ngayDK: this.checkRenew()? this._time.getDay("today") : this.infoForm.get('ngayDK').value,
        ngayVIP: this.checkRenew()? this.infoForm.get('ngayDK').value : ""
      }
      this._service.updateDocument("khach", this.selected, data, "khach-edit");
    }
    else if (mode == "del") {
      this._service.deleteDocument("khach", this.selected, "khach-del");
    }
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }
}
