import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class CartService {
  products: Object;
  Cart = {carrito:[]};
  cartOpen = false;
  session = {
    valid: false,
    user: 'skdfjsd'
  };
  subscription: Subscription;
  private subject = new Subject<any>();
  constructor() { 
  }
  sendClickEvento() {
    this.subject.next();
  }
  sendClickEvent(product) {
    this.subject.next(product);
  }
  getClickEvent(): Observable<any>{ 
    return this.subject.asObservable();
  }
  getClickEvento(): Observable<any>{ 
    return this.subject.asObservable();
  }

}
