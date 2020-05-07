import { Component, OnInit } from '@angular/core';
import { ProductService} from '../../../shared/service/product.service'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Object;
  constructor(
    private prod:ProductService
  ) { }

  ngOnInit() {
    this.prod.getProduct().subscribe((producto: any)=>{
      this.products = producto;
      console.log(this.products);
    },err =>{
      console.log(err);
      return false;
    });
  }
  
  

}
