import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';


@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
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

}
