import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service'
import { CartService} from '../../shared/service/cart.service';
import { Subscription } from 'rxjs/internal/Subscription';
declare var $: any;
@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  clickEventsubscription:Subscription;
  constructor(private auth: AuthService, private cart: CartService,) {
    
   }
  Order = {};
  showDiv = {
    current : true,
    next : false,
    nextn : false
  }
  
  correo: String;
  nombre: String;
  apellidoPaterno: String;
  apellidoMaterno: String;
  direccion: String;
  colonia: String;
  ciudad: String;
  estado: String;
  pais: String;
  cp: Number;
  telefono: Number;

  cNumber: String;
  cNombre: String;
  cCVC: Number;
  cExp: String;

  ngOnInit() {
    this.getCheckout();
  }
  GetCookies = function()
  {
    var cookies = document.cookie.split(';');
    var array = {};
    for( var i = 0; i < cookies.length; i++ )
    {
      var cookie = cookies[i].split('=');
      array[cookie[0]] = cookie[1];
    }
    return array;
  }

  getCheckout(){
    var self = this;
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/cart/checkout',
      xhrFields: {
        withCredentials: true
      },
      headers: {"Authorization": localStorage.getItem('id_token')},
      success: function(res){
        self.Order = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
  }
  userData(){
    const checkoutU = {
      correo: this.correo,
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      direccion: this.direccion,
      colonia: this.colonia,
      ciudad: this.ciudad,
      estado: this.estado,
      pais: this.pais,
      cp: this.cp,
      telefono: this.telefono,
      cNumber: this.cNumber,
      cNombre: this.cNombre,
      cCVC: this.cCVC,
      cExp: this.cExp
    }
    console.log(checkoutU)
    var self = this;
    $.ajax({
      method: 'post',
      url: 'http://localhost:2020/cart/checkout',
      xhrFields: {
        withCredentials: true
      },
      data: checkoutU,
      headers: {"Authorization": localStorage.getItem('id_token')},
      success: function(res){
        self.Order = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
  }
  finalize(){
    var self = this;
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/cart/finalize',
      xhrFields: {
        withCredentials: true
      },
      headers: {"Authorization": localStorage.getItem('id_token')},
      success: function(res){
        window.location.reload();
        self.Order = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
  }
  

  payment(){
    const checkout ={
      cNumber: this.cNumber,
      cNombre: this.cNombre,
      cCVC: this.cCVC,
      cExp: this.cExp
    }
    console.log(checkout)
    var self = this;
    $.ajax({
      method: 'post',
      url: 'http://localhost:2020/cart/checkout',
      xhrFields: {
        withCredentials: true
      },
      data: checkout,
      headers: {"Authorization": localStorage.getItem('id_token')},
      success: function(res){
        self.Order = res;
        console.log(res);
        console.log("Entra");
      },
      error: function() {
        console.log("No entra o se sale");
      }
    })
  }
  

}
