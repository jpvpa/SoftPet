import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service'
import { Router } from '@angular/router'
import { NgFlashMessageService } from 'ng-flash-messages';
import { ProductService} from '../../shared/service/product.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  products: Object;
  user: Object;
  constructor(
    private auth: AuthService,
    private prod:ProductService,
    private ngFlashMessageService: NgFlashMessageService,
    private router :Router
  ) { }
  search = {
    nombre: ''
  };
  ngOnInit() {
    this.auth.getProfile().subscribe((profile:any) =>{
      this.user = profile.user;
    },err =>{
      console.log(err);
      return false;
    });
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
