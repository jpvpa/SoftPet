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
  constructor(private route: ActivatedRoute, 
    private router: Router,
    private _location: Location) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(params => params.id))
      .subscribe(params => {
        console.log(params); // {order: "popular"}

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

}
