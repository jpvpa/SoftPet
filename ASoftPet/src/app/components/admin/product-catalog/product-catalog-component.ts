import { Component, OnInit, AfterViewInit } from '@angular/core';
/* import { ProductService} from '../../shared/service/product.service'; */
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
declare var $ : any;
@Component({
    selector: 'product-catalog-component',
    templateUrl: './product-catalog-component.html',
    styleUrls: ['./product-catalog-component.css']
  })

export class AdminCatalogComponent implements OnInit {
    products = [];
    nombre: '';
    departamento: '';
    categoria: '';
    precio: number;
    orden: 'asc';
    marca;
   
    rangoPrecio: Number;
    valor1;
    valor2;
   miarray: Number[];
  
   
    constructor(private route: ActivatedRoute, private router: Router) {
      router.events.subscribe((filter) => {
        this.nombre = this.route.snapshot.queryParams["nombre"];
        this.departamento = this.route.snapshot.queryParams["departamento"];
        this.categoria = this.route.snapshot.queryParams["categoria"];
        this.precio = this.route.snapshot.queryParams["precio"]
        this.orden = this.route.snapshot.queryParams["orden"];
        this.marca = this.route.snapshot.queryParams["marca"];
        this.rangoPrecio = this.route.snapshot.queryParams["rangoPrecio"]
        if(this.nombre || this.departamento || this.categoria || this.precio ||this.marca || this.rangoPrecio){
          this.precioRango();
          this.filtros();
        }else{
          this.searchProduct();
        }
      });
     }
     goProducts (){
      this.router.navigate([], { queryParams: {nombre: this.nombre, departamento: this.departamento, categoria: this.categoria, rangoPrecio: this.rangoPrecio, orden: this.orden, marca: this.marca} });
    }
    ngOnInit() {
      this.searchProduct()
      this.filtros()
    }
  
    precioRango(){
      
      if (this.rangoPrecio == 1) {
        this.valor1 = 1;
        this.valor2 = 100;
      } else if (this.rangoPrecio == 2) {
        this.valor1 = 100;
        this.valor2 = 500;
      } else if (this.rangoPrecio == 3) {
        this.valor1 = 500;
        this.valor2 = 1000;
      } else if (this.rangoPrecio == 4) {
        this.valor1 = 1000;
        this.valor2 = 2000;
      }  else {
        this.valor1 = 1;
        this.valor2 = 2000;
      }
    }
  
    filtros(){
      var params = '?';
      var numParams= 0;
      var self = this;
      this.precioRango();
      /* if(this.products !== undefined){
        console.log('show products');
      }else{
        console.log('show not found');
      } */
      if(this.nombre != null){
        params += (numParams != 0 ? '&' : '') + 'nombre=' +this.nombre;
        numParams++
      }
      if(this.departamento != null){
        params += (numParams != 0 ? '&' : '') + 'departamento=' +this.departamento;
        numParams++
      }
      if(this.categoria != null){
        params += (numParams != 0 ? '&' : '') + 'categoria=' +this.categoria;
        numParams++
      }
      if(this.rangoPrecio != null){
        params += (numParams != 0 ? '&' : '') + 'valor1='+this.valor1+"&valor2="+this.valor2;
        numParams++
      }
      if(this.orden != null){
        params += (numParams != 0 ? '&' : '') + 'order=' +this.orden;
        numParams++
      }
     if(this.marca != null){
        var par = 'marca='
        var flag=false;
        $("input:checkbox[name=marca]:checked").each(function(){
          if(!flag){
            par=par+$(this).val();
            flag=true;
          }else{
            par=par+"&marca="+$(this).val(); }         
        });
  
        params += (numParams != 0 ? '&' : '') +par
        
       
      }
      console.log(this.orden);
      console.log(params)
      var self = this
      $.ajax({
        method: 'get',
        url: 'http://localhost:2020/product/search'+params,
        success: function (result){
         self.products=result;
         console.log(result);
        },
        error: function(){
        self.products = [];
        } 
      })
    }
  
    searchProduct(){
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