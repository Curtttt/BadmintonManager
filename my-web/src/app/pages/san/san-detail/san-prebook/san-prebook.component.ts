import { Component, Input } from '@angular/core';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { crudService } from '../../../../../services/crud.service';

@Component({
  selector: 'app-san-prebook',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './san-prebook.component.html',
  styleUrl: '/src/app/pages/san/san-detail/san-detail.css'
})
export class SanPrebookComponent {
  @Input() maSan: string = "";
  dkiForm: any; khach_lst: any; sdt_lst: any = [];
  subscript!: Subscription;

  constructor(private fb: FormBuilder, private firestore: Firestore, private _service: crudService) {
    this.dkiForm = this.fb.group({
      nguoiDat: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern("0[0-9]{9}")]]
      // thueVot: Boolean
    });
  }

  ngOnInit(): void {
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
      this.dkiForm.get("nguoiDat").setValue(khach.TenKH);
  }

  xacNhan() {
    if (this.dkiForm.get('nguoiDat').valid && this.dkiForm.get('sdt').valid){
      let detail = this.dkiForm.getRawValue();
      detail['checkIn'] = Timestamp.now();
      let data = {
        chiTiet: detail,
        trangThai: "Đang hoạt động"
      }
      this._service.updateDocument('san', this.maSan, data);
      this.subscript.unsubscribe();
      this.dkiForm.reset();
    }
  }
}
