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
  infoForm: any; dkiForm: any; idx?: number;

  constructor(private _service: crudService, private _time: timeService, private fb: FormBuilder) {
    this.infoForm = fb.group({
      ten: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]],
      ngayDK: { value: '', disabled: true },
      gioThue: { value: '', disabled: true },
      tongTien: { value: '', disabled: true },
      hang: ''
    })

    this.dkiForm = fb.group({
      ten: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]]
    });

    this._service.getCollection("khach").then(docs => { this.kh$ = docs; });
    
  }

  ngOnInit(): void {
    this.subscript = this._service.changeListener.subscribe(change => {
      if (change != null){
        if (change.component == "khach-new")
          this.kh$ = change.target;
        else if (change.component == "khach-edit")
          this.kh$[this.idx!] = change.target;
        else if (change.component == "khach-del")
          this.kh$.splice(this.idx!, 1);
        this._service.clearChange(); }
    });  
  }

  getDetail(id_: string, idx: number) {
    this.selected = id_; this.idx = idx;
    let doc = this.kh$.find((kh: any) => kh.id == id_)!
    this.infoForm.setValue({
      ten: doc.ten,
      sdt: doc.sdt,
      ngayDK: doc.ngayDK,
      gioThue: `${doc.gioThue} h`,
      tongTien: doc.tongTien.toLocaleString("vi-VN") + " vnđ",
      hang: doc.hang
    })
  }

  func(mode: string) {
    if (mode == "new") {
      if (this.dkiForm.get('ten').valid && this.dkiForm.get('sdt').valid) {
        let data = {
          ten: this.dkiForm.get('ten').value,
          sdt: this.dkiForm.get('sdt').value,
          ngayDK: this._time.getCurrentDay(),
          gioThue: 0,
          tongTien: 0,
          hang: "Thường"
        }
        this._service.createDocument("khach", data, undefined, "khach-new");
        this.dkiForm.reset();
      }
    }
    else if (mode == 'edit') {
      let data = {
        ten: this.infoForm.get('ten').value,
        sdt: this.infoForm.get('sdt').value,
        hang: this.infoForm.get('hang').value
      }
      this._service.updateDocument("khach", this.selected, data, "khach-edit");
    }
    else {
      this._service.deleteDocument("khach", this.selected, "khach-del");

    }
  }

  ngOnDestroy(): void { this.subscript.unsubscribe(); }
}
