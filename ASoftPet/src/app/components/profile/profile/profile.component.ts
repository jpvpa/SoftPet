import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.getProfile().subscribe((profile:any) =>{
      this.user = profile.user;
    },err =>{
      console.log(err);
      return false;
    });
  }

  profilePhoto: string = '../../../../assets/images/default-profile.jpg';
  bio: string = 'Hello! just made an account on SoftPet';
  nombre: string = 'User';

}
