import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { NgFlashMessageService } from 'ng-flash-messages';
import { AuthService} from '../../shared/service/auth.service'

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  correo: String;
  contrasena: String;
  constructor(
    private auth: AuthService,
    private ngFlashMessageService: NgFlashMessageService,
    private router :Router
  ) { }

  ngOnInit() {
  }
  onLoginSubmit(){
    const user  = {
      correo: this.correo,
      contrasena: this.contrasena
    }

    this.auth.authUser(user).subscribe((data:any) =>{
      if(data.success){
        this.auth.storeUserData(data.token,data.user);
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Has iniciado sesión'],
          dismissible: true, 
          timeout: 3000,
          type: 'success'
        });
        if(this.correo === 'softpet.store@gmail.com'){
          this.router.navigate(['/product-list'])
        }else{
          this.router.navigate(['/profile-info'])
        }
      }else{
        this.ngFlashMessageService.showFlashMessage({
          messages: [data.msg],
          dismissible: true, 
          timeout: 3000,
          type: 'danger'
        });
        this.router.navigate(['/log-in'])
      }
    })
  }

}
