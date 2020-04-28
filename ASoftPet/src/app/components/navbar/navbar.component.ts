import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service'
import { Router } from '@angular/router'
import { NgFlashMessageService } from 'ng-flash-messages';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private ngFlashMessageService: NgFlashMessageService,
    private router :Router
  ) { }

  ngOnInit() {
  }
  onLogoutClick(){
    this.auth.logout();
    this.ngFlashMessageService.showFlashMessage({
      messages: ['Has cerrado sesión'],
      dismissible: true, 
      timeout: 3000,
      type: 'success'
    });
    this.router.navigate(['/log-in']);
  }

}
