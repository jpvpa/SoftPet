import { Component, OnInit, AfterViewInit } from '@angular/core';
/* import { ProductService} from '../../shared/service/product.service'; */
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
declare var $ : any;
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  departamento: string;
  categoria: String;
  img: '../../../assets/images/producto1.jpg';
  products = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    var self = this
    this.route.queryParams.pipe(
      filter(params => params.departamento))
      .subscribe(params => {
        console.log(params);
        this.departamento = params.departamento;
        console.log(this.departamento); 
        this.categoria = params.categoria;
        console.log(this.categoria);
      $.ajax({
        method: 'get',
        url: 'http://localhost:2020/product/search' +'?departamento='+this.departamento+'&categoria='+this.categoria ,
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


}
