import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service'
import { Router } from '@angular/router'
import { NgFlashMessageService } from 'ng-flash-messages';
import { CartService} from '../../shared/service/cart.service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  products: Object;
  user: Object;
  role;
  Cart = {};
  subscription: Subscription;
  cartOpen = false;
  session = {
    valid: false,
    user: 'skdfjsd'
  };
  Order = {};
  clickEventsubscription:Subscription;
  clickEventsubscripcion:Subscription;
  constructor(
    private auth: AuthService,
    private cart: CartService,
    private ngFlashMessageService: NgFlashMessageService,
    private router :Router
  ) { 
    this.clickEventsubscription= this.cart.getClickEvent().subscribe((product)=>{
      if(product){
        this.addToCart(product);
      }
      })
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
    this.auth.loggedIn()
    this.auth.loadToken()
    this.removeFromCart
    this.auth.getProfile().subscribe((profile:any) =>{
      this.user = profile.user;
    },err =>{
      console.log(err);
      return false;
    });
    var cookies = this.GetCookies();
    var self = this;
    $.get({
      url: 'http://localhost:2020/cart/generate',
      xhrFields: {
        withCredentials: true
      },
      headers: {"Authorization": localStorage.getItem('id_token')},
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
      headers: {"Authorization": localStorage.getItem('id_token')},
      success: function(res){
        self.Cart = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
  }
  /* getCheckout(){
    this.cart.sendClickEvento()
  } */

  onLogoutClick(){
    this.auth.logout();
    this.ngFlashMessageService.showFlashMessage({
      messages: ['Has cerrado sesión'],
      dismissible: true, 
      timeout: 3000,
      type: 'success'
    });
    this.router.navigate(['/log-in']);
    var self = this;
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/cart/finalize',
      xhrFields: {
        withCredentials: true
      },
      headers: {"Authorization": localStorage.getItem('id_token')},
      success: function(res){
        window.location.reload();
        self.Order = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
  }

  addToCart(product){
    var cookies = this.GetCookies();
    var self = this
    console.log(product.id)   
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/cart/add/'+product.id,
      xhrFields: {
        withCredentials: true
      },
      headers: {"Authorization": localStorage.getItem('id_token')},
      success: function(res){
        self.Cart = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
  }
  openNav() {
    $('#mySidebar').css("width","350px")
    $('#mySidebar').css("marginLeft","350px")
  }
  
  closeNav() {
    $('#mySidebar').css("width","0")
    $('#mySidebar').css("marginLeft","0")
  }


}
