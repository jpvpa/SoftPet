import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from "rxjs/operators";
import { CartService } from '../../shared/service/cart.service'
import { NgFlashMessageService } from 'ng-flash-messages';
declare var $ : any;
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  isLoadingProducts = true;
  products = [];
  nombre: '';
  departamento: '';
  categoria: '';
  precio: number;
  orden: 'asc';
  marca;
  Cart = {};

 
  rangoPrecio: Number;
  valor1;
  valor2;
  miarray: Number[];

  condicion: boolean = true;
  numero_resultados: number;
  n_articulos_seccion: number = 2; //se muestran 2 arcitulos por seccion por default debe coindicidir con el option selected
  numero_de_seccion: number = 0; //el control de paginacion indica la seccion atual, pero inicia en la seccion 0
  numero_de_secciones: number; //se asignan solas
  product: {};

  temporal_categoria: String;
  temporal_num_secciones: Number = 0;
  arreglo_seccionado = [];

  contador: number = 0;
 
  constructor(private route: ActivatedRoute, private router: Router, private cart: CartService,private ngFlashMessageService: NgFlashMessageService) {
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
    var self = this;
    this.addToCart
    this.searchProduct()
    this.route.queryParams
      .pipe(filter((params) => params.departamento))
      .subscribe((params) => {
        self.numero_de_seccion = 0;
      });
  }
  //---------------------Paginación!!---------------------
  Paginacion = function (condicion): void {
    this.arreglo_seccionado = [];
    if (!condicion) {
      for (var i = 0; i < this.numero_de_secciones; i++) {
        this.arreglo_seccionado.push(i);
      }
    }
  };
  Next = function () {
    if (this.numero_de_seccion < this.numero_de_secciones - 1) {
      this.numero_de_seccion++;
      this.filtros();
      this.Seccion($("#a" + (this.numero_de_seccion + 1))[0]);
    }
  };
  Previous = function () {
    if (this.numero_de_seccion > 0) {
      this.numero_de_seccion--;
      this.filtros();
      this.Seccion($("#a" + (this.numero_de_seccion + 1))[0]);
    }
  };
  Seccion = function (event) {
    $(".activado").removeClass("activado");
    $(event).addClass("activado");
  };

  /*******************************************/
  Extraer = function (inicio, limite, array) {
    return array.slice(inicio, limite);
  };
  /*******************************************/
  Seccionar = function (numero_resultados, n_articulos_seccion) {
    var self = this;
    var cont_secciones = 0;
    var inicio, fin;
    var residuo;
    var arreglo_secciones = [];
    // numero_resultados = 8 resultado=verdadero
    var num_secciones = Math.floor(numero_resultados / n_articulos_seccion);
    if(numero_resultados == 1){
      var num_secciones = Math.ceil(numero_resultados / n_articulos_seccion);
    }
    inicio = 0;
    fin = 0;
    console.log("Parametro 1 " + numero_resultados);
    console.log("parametro 2 " + n_articulos_seccion);
    if (numero_resultados % n_articulos_seccion == 0) {
      ///secciones exactas
      //primer
      if (num_secciones == 1) {
        inicio = 0;
        fin = numero_resultados - 1;
        cont_secciones = 0;
        /* console.log(inicio);
        console.log(fin); */
        arreglo_secciones[cont_secciones] = {
          datoinicio: inicio,
          datolimite: fin,
        };
        /* console.log("Seccion: " + cont_secciones);
        console.log("Numero de secciones: " + arreglo_secciones.length);
        console.log("-------------------------");
        console.log("\n"); */
      } else {
        cont_secciones = 0;
        //0 7
        for (
          var i = 0;
          i <= numero_resultados - 1;
          i = i + n_articulos_seccion
        ) {
          inicio = i; //0,2
          fin = i + n_articulos_seccion - 1; //1,3
          /* console.log(inicio);
          console.log(fin); */
          arreglo_secciones[cont_secciones] = {
            datoinicio: inicio,
            datolimite: fin,
          };
          // console.log("Seccion: " + cont_secciones);
          cont_secciones = cont_secciones + 1;
          /*console.log("\n"); */
        }
        /* console.log("Numero de secciones: " + arreglo_secciones.length);
        console.log("-------------------------"); */
      }
    } else {

      ///secciones no exactas
      residuo = numero_resultados % n_articulos_seccion;
      if (num_secciones == 0) {
        //si no se completa ninguna seccion entera
        if (residuo - 1 == 0) {
          inicio = 0;
          fin = null;
        } else {
          inicio = 0;
          fin = residuo - 1;
        }
        console.log(inicio);
        console.log(fin);
        cont_secciones = 0;
        arreglo_secciones[cont_secciones] = {
          datoinicio: inicio,
          datolimite: fin,
        };
        /* console.log("Seccion: " + cont_secciones);
        console.log("Numero de secciones: " + arreglo_secciones.length);
        console.log("-------------------------");
        console.log("\n"); */
      } else {
        cont_secciones = 0;
        //numero_resultados= 9
        for (var i = 0; i <= numero_resultados; i = i + n_articulos_seccion) {
          if (cont_secciones == num_secciones) {
            inicio = i; // 8
            fin = i + residuo - 1; // 8
            if (inicio == fin) {
              fin = null;
            }
          } else {
            inicio = i; //0, 4
            fin = i + n_articulos_seccion - 1; //3,7
          }
          /* console.log(inicio);
          console.log(fin); */
          arreglo_secciones[cont_secciones] = {
            datoinicio: inicio,
            datolimite: fin,
          };
          /* console.log("Seccion: " + cont_secciones); */
          cont_secciones = cont_secciones + 1;
          /* console.log("\n"); */
        }
        /* console.log("Numero de secciones: " + arreglo_secciones.length);
        console.log("-------------------------"); */
      }
    }
    self.numero_de_secciones = arreglo_secciones.length;
    return arreglo_secciones;
  };

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
   filtros = function () {
    var params = '?';
    var numParams= 0;
    var self = this;
    this.precioRango();
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
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/product/search'+params,
      success: function (result){
        self.isLoadingProducts = false;
       self.products=result;
       console.log(result);
       //Paginación
       if (self.products.length != 0) {
        /* console.log("LLamando a Seccionar"); */
        var respuesta = self.Seccionar(
          self.products.length,
          parseInt(self.n_articulos_seccion)
        );
        /* console.log(respuesta); */
        //Dato Entrada
        self.Paginacion(false);
        //reinicio de seccion actual con el uso de cualquier filtro dentro de un departamento
        /*****************************************************/
        //Todos los filtros que puedan cambiar la paginacion
        if (
          self.temporal_num_secciones != self.numero_de_secciones ||
          self.temporal_categoria != self.categoria) {
          if (self.temporal_num_secciones != self.numero_de_secciones) {
            self.temporal_num_secciones = self.numero_de_secciones;
          }
          if (self.temporal_categoria != self.categoria) {
            self.temporal_categoria = self.categoria;
          }
          self.numero_de_seccion = 0;
          //se marca y resalata la primer seccion
          $(".activado").removeClass("activado");
          $("#a1").addClass("activado");
          /* console.log(
            "Variable temporal de secciones" + self.temporal_num_secciones
          );
          console.log("Categoria" + self.temporal_categoria); */
        }
        /*****************************************************/
        if (respuesta[self.numero_de_seccion].datolimite != null) {
          self.condicion = true;

          self.products = self.Extraer(
            respuesta[self.numero_de_seccion].datoinicio,
            respuesta[self.numero_de_seccion].datolimite + 1,
            self.products
          );
        } else {
          self.condicion = false;
          self.product =
            self.products[respuesta[self.numero_de_seccion].datoinicio];
        }
        /* console.log("Numero de secciones " + self.numero_de_secciones);
        console.log("Numero de secciones products " + self.products.length); */
        //   console.log(self.products);
      } else {
        //    console.log(self.products);
        self.Paginacion(true);
        self.condicion = true;
       }
      },
      error: function () {
        self.isLoadingProducts = false;
        self.products = [];
      },
    });
  };
 searchProduct(){
    /* var self = this
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/product/list',
      xhrFields: {
        withCredentials: true,
      },
      success: function (result){
        //self.isLoadingProducts = false;
       self.products=result;
       console.log(result);
      },
      error: function(){
        //self.isLoadingProducts = false;
      self.products = [];
      } 
    }) */
  }
  addToCart(product){
    this.cart.sendClickEvent(product)
    this.ngFlashMessageService.showFlashMessage({
      messages: ['¡Estupendo! El producto se ha añadido al carrito'],
      dismissible: true, 
      timeout: 3000,
      type: 'success'
    });
  }



}