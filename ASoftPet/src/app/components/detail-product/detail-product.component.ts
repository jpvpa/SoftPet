import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {Location} from '@angular/common';
import { CartService } from '../../shared/service/cart.service';
import { NgFlashMessageService } from 'ng-flash-messages';
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
    private _location: Location,
    public cart: CartService,
    private ngFlashMessageService: NgFlashMessageService) { }

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
    this.cart.sendClickEvent(products)
    this.ngFlashMessageService.showFlashMessage({
      messages: ['Se ha añadido al carrito'],
      dismissible: true, 
      timeout: 3000,
      type: 'success'
    });
  }

}
