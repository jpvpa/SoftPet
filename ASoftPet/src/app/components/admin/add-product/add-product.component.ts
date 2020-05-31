import { Component, OnInit } from '@angular/core';
import { ProductService} from '../../../shared/service/product.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';
import { ValidateService} from '../../../shared/service/validate.service';
import {Location} from '@angular/common';

declare var $ : any;
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
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
  add = {
    id: ''
  };
  constructor(
    private product:ProductService,
    private ngFlashMessageService: NgFlashMessageService,
    private router: Router,
    private validService : ValidateService,
    private _location: Location,
    private route: ActivatedRoute
  ) {
    router.events.subscribe((filter) => {
      this.id = this.route.snapshot.queryParams["aid"];
      if(this.id){
        this.addProduct();
      }
    });
   }
   goid(){
    this.router.navigate([], { queryParams: {aid:this.id} });
   }
  ngOnInit() {
  }
  backClicked() {
    this._location.back();
  }
  addProduct(){
    console.log(this.id);
    var self = this
    $.ajax({
      method: 'post',
      data:
       {
        nombre:this.nombre,
        precio: this.precio,
        descripcion: this.descripcion,
        departamento: this.departamento,
        categoria: this.categoria,
        cantidad: this.cantidad,
        marca: this.marca
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
  /* onAddProduct(){
    const product = {
      id: this.id,
      nombre:this.nombre,
      precio: this.precio,
      descripcion: this.descripcion,
      departamento: this.departamento,
      categoria: this.categoria,
      cantidad: this.cantidad,
      marca: this.marca,
      imagen: this.imagen
    }
    if(!this.validService.allProductsFields(product)){
      this.ngFlashMessageService.showFlashMessage({
        messages: ["Por favor complete todos los campos"],
        dismissible: true, 
        timeout: 3000,
        type: 'danger'
      });
      return false;
    }

    console.log(product);
    this.product.addProduct(product).subscribe((data:any) => {
      
      console.log(data);
      if(data.success){
        this.ngFlashMessageService.showFlashMessage({
          messages: ["¡Producto Agregado!"],
          dismissible: true, 
          timeout: 3000,
          type: 'success'
        });
        console.log(data);
        this.router.navigate(['/product-list'])
      }else{
        this.ngFlashMessageService.showFlashMessage({
          messages: ["Ocurrio un error"],
          dismissible: true, 
          timeout: 3000,
          type: 'danger'
        });
        this.router.navigate(['/product-list'])
      }
      console.log(data);
    })
  } */
}
