import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  profilePhoto: string = '../../../../assets/images/default-profile.jpg';
  bio: string = 'Hello! just made an account on SoftPet';
  nombre: string = 'User';

}
