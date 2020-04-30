import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../../shared/service/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
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
  photoURL: String;
  bio: String;
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onEditSubmit(){
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
      photoURL: this.photoURL,
      bio: this.bio
    }
    console.log(user);
    this.router.navigate(['/profile-info'])
    this.auth.updateProfile(user).subscribe((data:any) => {
      console.log(data);
    })

  }

}
