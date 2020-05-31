import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products = [];
  nombre: '';
  departamento: '';
  categoria: '';
  orden: 'asc';
  pager = {};
  id:Number;
  search = {
    nombre: ''
  };
  show = false;
  constructor(private route: ActivatedRoute, private router: Router) {
    router.events.subscribe((filter) => {
      this.nombre = this.route.snapshot.queryParams["nombre"];
      this.departamento = this.route.snapshot.queryParams["departamento"];
      this.categoria = this.route.snapshot.queryParams["categoria"];
      this.orden = this.route.snapshot.queryParams["orden"];
      this.id = this.route.snapshot.queryParams["id"];
      if(this.nombre || this.departamento || this.categoria ||this.orden){
        console.log("filtros")
        this.filtros();
      }else if(this.id){
        this.onDelete();
      }else{
        console.log("show products")
        this.showProducts();
      }
    });
  }
  visibleIndex = -1;
  showSubItem(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }
  ngOnInit() {
    this.showProducts();
    this.filtros();
  }

  goProductsA (){
    this.router.navigate([], { queryParams: {nombre: this.nombre, departamento: this.departamento, categoria: this.categoria, orden: this.orden} });
  }
  
  filtros(){
    var params = '?';
    var numParams= 0;
    var self = this;

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
    if(this.orden != null){
      params += (numParams != 0 ? '&' : '') + 'order=' +this.orden;
      numParams++
    }
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

  onDelete(){
    
    var self = this
    console.log(this.id)
    $.ajax({
      method: 'delete',
      url: 'http://localhost:2020/product/'+this.id,
      success: function (result){
       self.products=result;
       self.router.navigate(['/product-list'])
      },
      error: function(){
      self.products = [];
      } 
      
    })
    console.log(this.products)
  }

  showProducts (){
    var self = this
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/product/list',
      success: function (result){
       self.products=result;
      },
      error: function(){
      self.products = [];
      } 
    })
  }

  
  
}
