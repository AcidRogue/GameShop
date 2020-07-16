import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent implements OnInit {
  @Input() id: string;
  constructor() { }

  ngOnInit(): void {
  }

}
