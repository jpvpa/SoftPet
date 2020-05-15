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
  nombre: String;
  marca: String;
  precio: String;
  rangoPrecio: Number;
  estado: boolean;
  orden: String = "asc";
  miarray: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  img: '../../../assets/images/producto1.jpg';
  products = [];
  visibleIndex = -1;
  constructor(private route: ActivatedRoute, private router: Router) {
    /*  console.log('Called Constructor');
    this.route.queryParams.subscribe(params => {
        this.nombre = params['nombre'];
        console.log(this.departamento);
        console.log(this.categoria);
        console.log(this.nombre);
        console.log(this.marca);
    });  */ 
  }

  BuscarRango = function () {
    var self = this;
    console.log(this.orden);

    if ($("input[id=RoyalCanin]").is(":checked")) {
      this.miarray[0] = 1;
    } else {
      this.miarray[0] = 0;
    }
    if ($("input[id=Pedigree]").is(":checked")) {
      this.miarray[1] = 1;
    } else {
      this.miarray[1] = 0;
    }
    if ($("input[id=Profine]").is(":checked")) {
      this.miarray[2] = 1;
    } else {
      this.miarray[2] = 0;
    }
    if ($("input[id=Whiskas]").is(":checked")) {
      this.miarray[3] = 1;
    } else {
      this.miarray[3] = 0;
    }
    if ($("input[id=Sera]").is(":checked")) {
      this.miarray[4] = 1;
    } else {
      this.miarray[4] = 0;
    }
    if ($("input[id=Ferplast]").is(":checked")) {
      this.miarray[5] = 1;
    } else {
      this.miarray[5] = 0;
    }
    if ($("input[id=SaniCat]").is(":checked")) {
      this.miarray[6] = 1;
    } else {
      this.miarray[6] = 0;
    }
    if ($("input[id=Mars]").is(":checked")) {
      this.miarray[7] = 1;
    } else {
      this.miarray[7] = 0;
    }
    if ($("input[id=Greenies]").is(":checked")) {
      this.miarray[8] = 1;
    } else {
      this.miarray[8] = 0;
    }
    if ($("input[id=Frolic]").is(":checked")) {
      this.miarray[9] = 1;
    } else {
      this.miarray[9] = 0;
    }
    if ($("input[id=Beco]").is(":checked")) {
      this.miarray[10] = 1;
    } else {
      this.miarray[10] = 0;
    }
    console.log(this.miarray);
    var valor1, valor2;
    if (this.rangoPrecio == 1) {
      valor1 = 1;
      valor2 = 100;
    } else if (this.rangoPrecio == 2) {
      valor1 = 100;
      valor2 = 500;
    } else if (this.rangoPrecio == 3) {
      valor1 = 500;
      valor2 = 1000;
    } else if (this.rangoPrecio == 4) {
      valor1 = 1000;
      valor2 = 2000;
    } else if (this.rangoPrecio == 5) {
      valor1 = 1;
      valor2 = 2000;
    } else {
      valor1 = 1;
      valor2 = 2000;
    }
    console.log(this.rangoPrecio);
    console.log(this.departamento);
    console.log(this.categoria);
    console.log(this.nombre);
    if(this.departamento == undefined && this.nombre){
      var param = "?nombre="+this.nombre +"&valor1=" +valor1+"&valor2="+valor2+"&order="+this.orden+"&marcas="+
    this.miarray[0] +"," +this.miarray[1] +"," +this.miarray[2] +"," +this.miarray[3] +"," +this.miarray[4] +"," +
    this.miarray[5] +"," +this.miarray[6] +"," +this.miarray[7] +"," +this.miarray[8] +"," +this.miarray[9] +"," +this.miarray[10];
    }
    else if(this.nombre && this.departamento) {
      var param = "?departamento="+this.departamento+"&nombre="+this.nombre +"&valor1=" +valor1+"&valor2="+valor2+"&order="+this.orden+"&marcas="+
      this.miarray[0] +"," +this.miarray[1] +"," +this.miarray[2] +"," +this.miarray[3] +"," +this.miarray[4] +"," +
      this.miarray[5] +"," +this.miarray[6] +"," +this.miarray[7] +"," +this.miarray[8] +"," +this.miarray[9] +"," +this.miarray[10];
    } else {
      var param = "?departamento="+this.departamento+"&categoria="+this.categoria +"&valor1=" +valor1+"&valor2="+valor2+"&order="+this.orden+"&marcas="+
      this.miarray[0] +"," +this.miarray[1] +"," +this.miarray[2] +"," +this.miarray[3] +"," +this.miarray[4] +"," +
      this.miarray[5] +"," +this.miarray[6] +"," +this.miarray[7] +"," +this.miarray[8] +"," +this.miarray[9] +"," +this.miarray[10];
    }
    console.log(param);
    $.ajax({
      method: "get",
      url:
        "http://localhost:2020/product/searchRange" +param,
      success: function (result) {
        self.products = result;
        console.log(result);
      },
      error: function () {
        self.products = [];
      },
    });
  };
  
  ngOnInit() {
    
    
    var self = this;
    this.route.queryParams
      .pipe(filter((params) => params.departamento || params.nombre ))
      .subscribe((params) => {
        console.log(params);
        console.log(this.miarray);
        $("input[id=customRadio5]").prop("checked", true);
        $("input[id=RoyalCanin]").prop("checked", true);
        $("input[id=Pedigree]").prop("checked", true);
        $("input[id=Profine]").prop("checked", true);
        $("input[id=Whiskas]").prop("checked", true);
        $("input[id=Sera]").prop("checked", true);
        $("input[id=Ferplast]").prop("checked", true);
        $("input[id=SaniCat]").prop("checked", true);
        $("input[id=Mars]").prop("checked", true);
        $("input[id=Greenies]").prop("checked", true);
        $("input[id=Frolic]").prop("checked", true);
        $("input[id=Beco]").prop("checked", true);

        this.departamento = params.departamento;
        console.log(this.departamento);
        this.categoria = params.categoria;
        console.log(this.categoria);
        this.nombre = params.nombre;
        console.log(this.nombre);


        this.BuscarRango()
        /*     var valor1, valor2;
        if (this.rangoPrecio == 1) {
          valor1 = 1;
          valor2 = 100;
        } else if (this.rangoPrecio == 2) {
          valor1 = 100;
          valor2 = 500;
        } else if (this.rangoPrecio == 3) {
          valor1 = 500;
          valor2 = 1000;
        } else if (this.rangoPrecio == 4) {
          valor1 = 1000;
          valor2 = 2000;
        } else if (this.rangoPrecio == 5) {
          valor1 = 1;
          valor2 = 2000;
        } else {
          valor1 = 1;
          valor2 = 2000;
        }

        if(this.departamento == undefined && this.nombre){
          var param = "?nombre="+this.nombre +"&valor1=" +valor1+"&valor2="+valor2+"&order="+this.orden+"&marcas="+
        this.miarray[0] +"," +this.miarray[1] +"," +this.miarray[2] +"," +this.miarray[3] +"," +this.miarray[4] +"," +
        this.miarray[5] +"," +this.miarray[6] +"," +this.miarray[7] +"," +this.miarray[8] +"," +this.miarray[9] +"," +this.miarray[10];
        }
        else if(this.nombre && this.departamento) {
          var param = "?departamento="+this.departamento+"&nombre="+this.nombre +"&valor1=" +valor1+"&valor2="+valor2+"&order="+this.orden+"&marcas="+
          this.miarray[0] +"," +this.miarray[1] +"," +this.miarray[2] +"," +this.miarray[3] +"," +this.miarray[4] +"," +
          this.miarray[5] +"," +this.miarray[6] +"," +this.miarray[7] +"," +this.miarray[8] +"," +this.miarray[9] +"," +this.miarray[10];
        } else {
          var param = "?departamento="+this.departamento+"&categoria="+this.categoria +"&valor1=" +valor1+"&valor2="+valor2+"&order="+this.orden+"&marcas="+
          this.miarray[0] +"," +this.miarray[1] +"," +this.miarray[2] +"," +this.miarray[3] +"," +this.miarray[4] +"," +
          this.miarray[5] +"," +this.miarray[6] +"," +this.miarray[7] +"," +this.miarray[8] +"," +this.miarray[9] +"," +this.miarray[10];
        }
        $.ajax({
          method: "get",
          url:
            "http://localhost:2020/product/search" +param,
          success: function (result) {
            self.products = result;
            console.log(result);
          },
          error: function () {
            self.products = [];
          },
        }); */
      });
  }



    showSubItem(ind) {
      if (this.visibleIndex === ind) {
        this.visibleIndex = -1;
      } else {
        this.visibleIndex = ind;
      }
    }

}