import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../shared/service/auth.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  correo: String;
  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  /* onRecoverPassword(){
    const user = {
      correo: this.correo
    }
    this.auth.recoverUser(user).subscribe((data:any) => {
      console.log(data);
    })
  } */
}
