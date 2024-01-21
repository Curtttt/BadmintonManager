import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-san-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './san-list.component.html',
  styleUrl: './san-list.component.css'
})
export class SanListComponent {
  arr = Array.from({length: 5}, (v, i) => i + 1);

}
