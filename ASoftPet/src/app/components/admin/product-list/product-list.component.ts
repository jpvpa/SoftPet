import { Component, OnInit, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements AfterViewInit, OnInit {
  products = [];
  constructor() {}
  ngOnInit() {}

  ngAfterViewInit() : void {
    this.showProducts();
  }

  showProducts = function (){
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
  
}
