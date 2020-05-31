import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { filter } from 'rxjs/operators';
declare var $ : any;
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  products = [];
  id:Number;
  nombre: String;
  precio: Number;
  descripcion: String;
  departamento: String;
  categoria: String;
  cantidad: Number;
  marca: String;
  imagen: String;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private _location: Location
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(params => params.id))
      .subscribe(params => {
        console.log(params);
        this.id = params.id;
        this.nombre = params.nombre;
        this.getallprod(); 
      });
  }
   getallprod(){
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
  }
  editProduct(){
    
    var self = this
    $.ajax({
      method: 'put',
      data:
       {
        id: this.id,
        nombre:this.nombre,
        precio: this.precio,
        descripcion: this.descripcion,
        departamento: this.departamento,
        categoria: this.categoria,
        cantidad: this.cantidad,
        marca: this.marca,
        imagen: this.imagen
      },
      url: 'http://localhost:2020/product/'+this.id,
      success: function (result){
       self.products=result;
       console.log(result);
       self.router.navigate(['/product-list'])
      },
      error: function(){
      self.products = [];
      } 
    })
    console.log(this.products)
    
  }
  onEditProduct(){
    
    this.router.navigate(['/product-list'])
  }
  backClicked() {
    this._location.back();
  }


}
