import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {

  constructor() { }
  Order = {};
  ngOnInit() {
    this.finalize()
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
