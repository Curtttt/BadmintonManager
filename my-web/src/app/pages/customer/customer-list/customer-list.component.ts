import { Component, OnDestroy, OnInit } from '@angular/core';
import { crudService } from '../../../../services/crud.service';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CustomerDetailComponent],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit, OnDestroy{
  kh$: any; selected?: string;
  constructor(private _service: crudService) {}

  ngOnInit(): void {
    this._service.getCollection("khach").then(docs => { this.kh$ = docs; });
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }


}
