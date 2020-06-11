import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service'
import { Router } from '@angular/router'
import { NgFlashMessageService } from 'ng-flash-messages';
import { ProductService} from '../../shared/service/product.service';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NavbarComponent implements OnInit {
  products: Object;
  user: Object;
  role;
  Cart = {};
  cartOpen = false;
  session = {
    valid: false,
    user: 'skdfjsd'
  };
  constructor(
    private auth: AuthService,
    private prod:ProductService,
    private ngFlashMessageService: NgFlashMessageService,
    private router :Router
  ) { 
  }
  search = {
    nombre: ''
  };
  GetCookies = function()
  {
    var cookies = document.cookie.split(';');
    var array = {};
    for( var i = 0; i < cookies.length; i++ )
    {
      var cookie = cookies[i].split('=');
      array[cookie[0]] = cookie[1];
    }
    return array;
  }

  ngOnInit() {
    this.auth.getProfile().subscribe((profile:any) =>{
      this.user = profile.user;
    },err =>{
      console.log(err);
      return false;
    });
<<<<<<< Updated upstream
=======
    var cookies = this.GetCookies();
    var self = this;
    $.get({
      url: 'http://localhost:2020/cart/generate',
      xhrFields: {
        withCredentials: true
      },
      success: function (res) {
        self.Cart = res;
        console.log(res);
      } 
    });
  }

  removeFromCart(product){
    var cookies = this.GetCookies();
    var self = this
    console.log(product.id)
    $.ajax({
      method: 'post',
      url: 'http://localhost:2020/cart/remove/'+product.id,
      xhrFields: {
        withCredentials: true
      },
      success: function(res){
        self.Cart = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
>>>>>>> Stashed changes
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

  openNav() {
    $('#mySidebar').css("width","350px")
    $('#mySidebar').css("marginLeft","350px")
  }
  
  closeNav() {
    $('#mySidebar').css("width","0")
    $('#mySidebar').css("marginLeft","0")
  }
  trackByProdName(index: number, product: any): string {
    return product.id;
  }

}
