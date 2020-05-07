import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.nombre == undefined || user.correo == undefined|| user.contrasena == undefined){
      return false;
    }else{
      return true;
    }
  }
  validateEmail(correo){
    const regE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regE.test(correo);
  }

  allProductsFields(producto){
    if( !producto.nombre || !producto.precio || !producto.descripcion || !producto.departamento || !producto.categoria || !producto.cantidad || !producto.marca){
      return false;
    }else{
      return true;
    }
  }

}
