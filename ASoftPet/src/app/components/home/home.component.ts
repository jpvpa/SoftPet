import { Component, OnInit } from '@angular/core';
declare var $ : any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products=[]
  Cart={}
  constructor() { }

  ngOnInit() {
    this.addToCart
    var self = this
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/product/list',
      success: function (result){
       self.products=result;
       console.log(result);
      },
      error: function(){
      self.products = [];
      } 
    })
  }
  
  valores = [
    {
      titulo: 'Misión',
      subtitle: 'SoftPet',
      description: 'Esta es la mision blablabla',
      color: 'primary',
      img: '../../../assets/images/mision.png'
    },
    {
      titulo: 'Visión',
      subtitle: 'SoftPet',
      description: 'Esta es la vision blablabla',
      color: 'success',
      img: '../../../assets/images/vision.png'
    },
    {
      titulo: 'Valores',
      subtitle: 'SoftPet',
      description: 'Estos son los valores blablabla',
      color: 'danger',
      img: '../../../assets/images/diamante.png'
    },
  ]

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
