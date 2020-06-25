import { Component } from '@angular/core';
import { AuthService } from './shared/service/auth.service';
import { CartService } from './shared/service/cart.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SoftPet';

  user: Object;
  Cart = {};
  session = {
    valid: false,
    user: 'skdfjsd'
  };
  constructor(
    private auth: AuthService,
    public cart: CartService
  ) { }
  
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
    this.auth.getProfile().subscribe((profile:any) =>{
      this.user = profile.user;
      
    },err =>{
      console.log(err);
      return false;
    });
  }
      trackByProdName(index: number, product: any): string {
        return product.name;
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
}
