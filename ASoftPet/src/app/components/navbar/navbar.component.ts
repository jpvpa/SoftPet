import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service'
import { Router } from '@angular/router'
import { NgFlashMessageService } from 'ng-flash-messages';
import { ProductService} from '../../shared/service/product.service';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  products: Object;
  user: Object;
  role;
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
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/cart/generate',
      success: function(output, status, xhr) {
        alert(xhr.getResponseHeader("Set-Cookie"));
    },
    cache: false
    })
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
