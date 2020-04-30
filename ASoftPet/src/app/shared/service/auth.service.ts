import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt';
export interface RegisterResponse {
  success: boolean;
  msg: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) { }

  registerUser(user){
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:2020/register', user, {headers: headers})
  }
  authUser(user){
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:2020/auth', user, {headers: headers}) 
  }
  getProfile(){
    var headers = new HttpHeaders({'Authorization': this.authToken, 'Content-Type': 'application/json'});
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:2020/profile', {headers: headers})
  }
  updateProfile(user){
    var headers = new HttpHeaders({'Authorization': this.authToken, 'Content-Type': 'application/json'});
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type', 'application/json');
    console.log(user);
    return this.http.put('http://localhost:2020/updateProfile', JSON.stringify(user), {headers: headers})
  }
  /* recoverUser(user){
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:2020/forgot-password', user, {headers: headers})
  } */
  storeUserData(token, user){
    localStorage.setItem('id_token', token); 
    localStorage.setItem('correo', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  //fetch it from local storage
  loadToken(){
    const token = localStorage.getItem('id_token');
    console.log(token)
    this.authToken = token;
  }

  loggedIn() {
    if (localStorage.id_token == undefined ){
      return false
     } else {
   const helper = new JwtHelperService();
     return !helper.isTokenExpired(localStorage.id_token);
     }
  }

  
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
