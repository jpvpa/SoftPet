import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from "rxjs/operators";
import { NgFlashMessageService } from 'ng-flash-messages';
declare var $ : any;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  isLoadingProducts = true;
  products = [];
  nombre: '';
  departamento: '';
  categoria: '';
  precio: number;
  orden: 'asc';
  marca;
  id: number;
  Cart = {};
  search = {
    nombre: ''
  };
 
  rangoPrecio: Number;
  valor1;
  valor2;
  miarray: Number[];

  condicion: boolean = true;
  numero_resultados: number;
  n_articulos_seccion: number = 8; //se muestran 2 arcitulos por seccion por default debe coindicidir con el option selected
  numero_de_seccion: number = 0; //el control de paginacion indica la seccion atual, pero inicia en la seccion 0
  numero_de_secciones: number; //se asignan solas
  product: {};

  temporal_categoria: String;
  temporal_num_secciones: Number = 0;
  arreglo_seccionado = [];

  contador: number = 0;
 
  constructor(private route: ActivatedRoute, private router: Router, private ngFlashMessageService: NgFlashMessageService) {
    router.events.subscribe((filter) => {
      this.nombre = this.route.snapshot.queryParams["nombre"];
      this.departamento = this.route.snapshot.queryParams["departamento"];
      this.categoria = this.route.snapshot.queryParams["categoria"];
      this.orden = this.route.snapshot.queryParams["orden"];
      this.id = this.route.snapshot.queryParams["id"];
      if(this.nombre || this.departamento || this.categoria || this.orden){
        this.filtros();
      }else{
        this.searchProduct();
      }
      if(this.id){
        this.onDelete();
      }
    });
   }
   goProductsA (){
    this.router.navigate([], { queryParams: {nombre: this.nombre, departamento: this.departamento, categoria: this.categoria, orden: this.orden, id:this.id} });
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
    var self = this;
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
      if(this.nombre || this.departamento || this.categoria){
        this.filtros();
      }else{
        this.searchProduct();
      }
      this.Seccion($("#a" + (this.numero_de_seccion + 1))[0]);
    }
  };
  Previous = function () {
    if (this.numero_de_seccion > 0) {
      this.numero_de_seccion--;
      if(this.nombre || this.departamento || this.categoria){
        this.filtros();
      }else{
        this.searchProduct();
      }
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
        console.log(inicio);
        console.log(fin);
        arreglo_secciones[cont_secciones] = {
          datoinicio: inicio,
          datolimite: fin,
        };
        /* console.log("Seccion: " + cont_secciones);
        console.log("Numero de secciones: " + arreglo_secciones.length); */
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
          /* console.log("Seccion: " + cont_secciones); */
          cont_secciones = cont_secciones + 1;
        }
        /* console.log("Numero de secciones: " + arreglo_secciones.length); */
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
         /*  console.log("\n"); */
        }
        /* console.log("Numero de secciones: " + arreglo_secciones.length);
        console.log("-------------------------"); */
      }
    }
    self.numero_de_secciones = arreglo_secciones.length;
    return arreglo_secciones;
  };
   filtros = function () {
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
        console.log("LLamando a Seccionar");
        var respuesta = self.Seccionar(
          self.products.length,
          parseInt(self.n_articulos_seccion)
        );
        console.log(respuesta);
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
 searchProduct = function(){
    var self = this
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/product/list',
      success: function (result){
        self.isLoadingProducts = false;
       self.products=result;
       console.log(result);
       if (self.products.length != 0) {
        var respuesta = self.Seccionar(
          self.products.length,
          self.n_articulos_seccion
        ); //Dato Entrada

        /* console.log(
          "Numero articulos por seccion " + self.n_articulos_seccion
        );
        console.log("Seccion actual " + self.numero_de_seccion); */
        self.Paginacion(false);

        //se marca la primer secccion
        if (self.temporal_num_secciones == 0) {
          /* console.log("Se inicializa el numero de secciones actuales"); */
          self.temporal_num_secciones = self.numero_de_secciones;
          /* console.log(
            "Numero de secciones temporal" + self.temporal_num_secciones
          ); */
        }
        if (!self.temporal_categoria) {
         /*  console.log("Se inicializa temporal categoria"); */
          self.temporal_categoria = self.categoria;
          /* console.log(
            "Numero de cat temporal " + self.temporal_categoria
          ); */
        }

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
        console.log("longitud del arreglo " + self.products.length);
        console.log(self.products); */
      } else {
        console.log(self.products);
        self.Paginacion(true);
        self.condicion = true;
      }
      },
      error: function () {
        self.isLoadingProducts = false;
        self.products = [];
      },
    });
 }
deleteMessage= false;
 onDelete(){
   var self = this
  console.log(this.id)
  $.ajax({
    method: 'delete',
    url: 'http://localhost:2020/product/'+this.id,
    success: function (result){
     self.products=result;
     //self.router.navigate(['/product-list'])
    },
    error: function(){
    self.products = [];
    } 
    
  })
  console.log(this.products)
}
  
  
}
