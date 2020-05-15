import { Component, OnInit } from '@angular/core';
import { ProductService} from '../../../shared/service/product.service'
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';
import { ValidateService} from '../../../shared/service/validate.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
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
    private products:ProductService,
    private ngFlashMessageService: NgFlashMessageService,
    private router: Router,
    private validService : ValidateService
  ) { }
  uploadedFiles: Array < File > ;
  ngOnInit() {
  }

  onAddProduct(){
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
    this.products.addProduct(product).subscribe((data:any) => {
      
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
        this.router.navigate(['/add-product'])
      }
      console.log(data);
    })
  }
}
