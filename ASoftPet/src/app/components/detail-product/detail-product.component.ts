import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {Location} from '@angular/common';
declare var $ : any;
@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  products = [];
  id: Number;
  Cart={}
  constructor(private route: ActivatedRoute, 
    private router: Router,
    private _location: Location) { }

  ngOnInit() {
    this.addToCart
    this.route.queryParams.pipe(
      filter(params => params.id))
      .subscribe(params => {
        console.log(params);

        this.id = params.id;
        console.log(this.id); 
        var self = this
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/product/'+this.id,
      success: function (result){
       self.products=result;
       console.log(result);
      },
      error: function(){
      self.products = [];
      } 
    })
      });
    
  }
  backClicked() {
    this._location.back();
  }
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
  addToCart(products){
    var cookies = this.GetCookies();
    var self = this
    console.log(products.id)
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/cart/add/'+products.id,
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
