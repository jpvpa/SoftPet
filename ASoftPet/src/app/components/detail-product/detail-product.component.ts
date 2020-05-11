import { Component, OnInit } from '@angular/core';
declare var $ : any;
@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  products = [];
  constructor() { }

  ngOnInit() {
    var self = this
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/product/:id',
      success: function (result){
       self.products=result;
       console.log(result);
      },
      error: function(){
      self.products = [];
      } 
    })
  }

}
