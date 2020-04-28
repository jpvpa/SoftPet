import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../../shared/service/validate.service'
import { AuthService} from '../../shared/service/auth.service'
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  correo: String;
  contrasena: String;
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
  constructor(
    private validService : ValidateService,
    private ngFlashMessageService: NgFlashMessageService,
    private auth: AuthService,
    private router: Router
  ) { }
  /* estados: any = (estado as any).default; */
  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      correo: this.correo,
      contrasena: this.contrasena,
      direccion: this.direccion,
      colonia: this.colonia,
      ciudad: this.ciudad,
      estado: this.estado,
      pais: this.pais,
      cp: this.cp,
      telefono: this.telefono,
    }
    console.log(user);
    //
    if(!this.validService.validateRegister(user)){
      this.ngFlashMessageService.showFlashMessage({
        messages: ["Por favor complete todos los campos"],
        dismissible: true, 
        timeout: 3000,
        type: 'danger'
      });
      return false;
    }
    if(!this.validService.validateEmail(user.correo)){
      this.ngFlashMessageService.showFlashMessage({
        messages: ["Por favor ingrese un correo valido"],
        dismissible: true, 
        timeout: 3000,
        type: 'danger'
      });
      return false;
    } 
    
    this.auth.registerUser(user).subscribe((data:any) =>{
      if(data.success){
        this.ngFlashMessageService.showFlashMessage({
          messages: ["¡Cuenta registrada!"],
          dismissible: true, 
          timeout: 3000,
          type: 'success'
        });
        this.router.navigate(['/log-in'])
      }else{
        this.ngFlashMessageService.showFlashMessage({
          messages: ["Ocurrio un error"],
          dismissible: true, 
          timeout: 3000,
          type: 'danger'
        });
        this.router.navigate(['/sign-up'])
      }
    });


  }

}
