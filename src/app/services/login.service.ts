import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from './usuarios/usuarios-nit.service';
import { environment } from '../../environments/environment';
import { WebsocketService } from './sockets/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = environment.wsUrl;
  userToken: string;
  estacion: number;
  idUsuarioNIT: string;
  expiresIn: string;
  salaUsuarioNIT: string;

  constructor( private http: HttpClient) {
    this.leerToken();
    this.leerIDUsuario();
  }

  logout() {

  }

  // =====================
  // INICIAR SESIÓN
  // =====================
  login(usuario: Usuario) {
    const body = {
      usuario: usuario.usuario,
      contrasena: usuario.contrasena
    };

    
    return this.http.post(`${this.url}/login/`, body)
    .pipe(
      map( (resp: any) => {
        if (resp.token) {
          console.log(resp);
          // Guardar la información del usuario 
          this.guardarToken(resp.token);
          this.guardarIDUsuario(resp.id_usuario);
          this.guardarEstacion(resp.estacion);
          this.guardarExpires(resp.expiresIn);
          this.guardarSala(resp.sala);
        }
        return resp;
      })
    );

  }

  // =========================
  // AGREGAR NUEVO USUARIO NIT
  // ========================= 
  nuevoUsuario(usuario: Usuario) {
    const body = {
      contrasena: usuario.contrasena, 
      nombres: usuario.nombres, 
      apellPat: usuario.apellPat, 
      apellMat: usuario.apellMat,
      usuario: usuario.usuario,
      tipo: 1,
      // tipo: usuario.tipo, // No esta en el form
      depend: 'Bomberos', 
      // usuario.depend
      sexo: 'F',
      // sexo: usuario.sexo, // No esta en el form
      estatus: 1,
      // estatus: usuario.estatus   // No esta en el form 
    }
    return this.http.post(`${this.url}/usuarionit`, body);
  }

  // =========================================
  // GUARDAR 
  // =========================================
  private guardarToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  private guardarEstacion( idEstacion: string ) {
    this.estacion = Number.parseInt(idEstacion);
    localStorage.setItem('estacion', idEstacion);
  }

  private guardarIDUsuario ( idUsuario: string ) {
    this.idUsuarioNIT = idUsuario;
    localStorage.setItem('idUsuario', idUsuario);
  }

  private guardarExpires ( expiresIn: any ) {
    let expiraDate = new Date();
    expiraDate.setSeconds(expiresIn);
    this.expiresIn = expiraDate.getTime().toString();
    localStorage.setItem('expiresIn', this.expiresIn.toString());
  }

  private guardarSala ( sala: any ) {
    this.salaUsuarioNIT = sala;
    localStorage.setItem('sala', sala);
  }

  // =========================================
  // ESTA AUTENTICADO (Validar la fecha del token)
  // =========================================
  estaAutenticado(): Boolean{
    if(this.userToken === undefined){
      return false;
    }
    if(this.userToken.length < 2){
      return false;
    }
    let expiracion = this.leerExpiracion();
    const expiraDate = new Date();
    expiraDate.setTime(Number(expiracion));
    const hoy = new Date();
    // console.log('Hoy es: ' + hoy);
    // console.log('Expira el día: ' + expiraDate);

    if(expiraDate > new Date()){
      return true;
    } else {
      this.cerrarSesion();
      return false;
    }
  }

  // =========================================
  // SIGUE DESARROLLAR EL CIERRE DE SESION
  // =========================================
  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('estacion');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('sala');
  }

  // =========================================
  // LEER
  // =========================================
  leerToken() {
    if ( localStorage.getItem('token') ){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  leerEstacion() {
    if ( localStorage.getItem('estacion') ){
      this.estacion = Number.parseInt(localStorage.getItem('estacion'));
    } else {
      this.estacion = undefined;
    }
    return this.estacion;
  }

  leerIDUsuario() {
    if( localStorage.getItem('idUsuario')){
      this.idUsuarioNIT = localStorage.getItem('idUsuario');
    } else{
      this.idUsuarioNIT = '';
    }
    return this.idUsuarioNIT;
  }

  leerExpiracion(){
    if(localStorage.getItem('expiresIn')){
      return this.expiresIn = localStorage.getItem('expiresIn');
    } else {
      return this.expiresIn = undefined;
    }
  }

  leerSala(){
    if(localStorage.getItem('sala')){
      return this.salaUsuarioNIT= localStorage.getItem('sala');
    } else {
      return this.salaUsuarioNIT = undefined;
    }
  }

}
