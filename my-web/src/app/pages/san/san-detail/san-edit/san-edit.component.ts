import { Component, Input, OnInit } from '@angular/core';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { crudService } from '../../../../../services/crud.service';

@Component({
  selector: 'app-san-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './san-edit.component.html',
  styleUrl: '/src/app/pages/san/san-detail/san-detail.css'
})
export class SanEditComponent implements OnInit {
  @Input() maSan: string = "";
  @Input() editData?: any;
  editForm: any; khach_lst: any; sdt_lst: any = [];
  subscript!: Subscription;

  constructor(private fb: FormBuilder, private firestore: Firestore, private _service: crudService) {
    this.editForm = this.fb.group({
      nguoiDat: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]]
      // thueVot: Boolean
    });
  }

  ngOnInit() {
    this.subscript = this._service.getCollection('user').subscribe(doc => {
      this.khach_lst = doc;
      this.khach_lst.forEach((khach: any) => {
        this.sdt_lst.push(khach.SDT);
      });
    });
  }

  getName(sdt: string) {
    let khach = this.khach_lst.find((khach: any) => khach.SDT === sdt);
    if (khach != undefined)
      this.editForm.get("nguoiDat").setValue(khach.TenKH);
  }

  xacNhan() {
    if (this.editForm.get('nguoiDat').valid && this.editForm.get('sdt').valid){
      let detail = this.editForm.getRawValue();
      detail['checkIn'] = Timestamp.now();
      let data = {
        chiTiet: detail,
        trangThai: "Đang hoạt động"
      }
      this._service.updateDocument('san', this.maSan, data);
      this.subscript.unsubscribe();
      this.editForm.reset();
    }
  }
}
