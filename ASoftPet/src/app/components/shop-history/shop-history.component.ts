import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service';
declare var $: any;
@Component({
  selector: 'app-shop-history',
  templateUrl: './shop-history.component.html',
  styleUrls: ['./shop-history.component.css']
})
export class ShopHistoryComponent implements OnInit {
  Order = {};
  user: {};
  profilePhoto: string = '../../../../assets/images/default-profile.jpg';
  constructor(private auth : AuthService) { }

  ngOnInit() {
    this.getOrder()
    this.auth.getProfile().subscribe((profile:any) =>{
      this.user = profile.user;
      
    },err =>{
      console.log(err);
      return false;
    });
  }
  getOrder(){
    var self = this;
    $.ajax({
      method: 'get',
      url: 'http://localhost:2020/cart/order',
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
  visibleIndex = -1;
  showSubItem(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }

}
