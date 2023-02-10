import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { Usuario } from './usuarios/usuarios-nit.service';
import { environment } from '../../environments/environment';
import { WebsocketService } from './sockets/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = environment.wsUrl;
  userToken: string;
  id_asociacion: number = 0;
  estacion: number;
  idUsuarioNIT: string;
  expiresIn: string;
  salaUsuarioNIT: string;
  tipoPermiso: string;

  constructor( private http: HttpClient, private router: Router) {
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
          // Es un usuario inválido
          if(this.buscarPermiso(resp) === ''){
            return { ok: false };
          }

          // Guardar la información del usuario 
          this.guardarAsociacion(Number.parseInt(resp.id_asociacion));
          this.guardarToken(resp.token);
          this.guardarIDUsuario(resp.id_usuario);
          this.guardarEstacion(resp.estacion);
          this.guardarExpires(resp.expiresIn);
          this.guardarSala(resp.sala);
          this.guardarTipoPermiso(this.buscarPermiso(resp));
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
  
  private guardarAsociacion( idAsociacion: number ) {
    if(idAsociacion != 0){
      this.id_asociacion = idAsociacion;
      localStorage.setItem('asoc', idAsociacion+'');
    } else {
      this.id_asociacion = 0;
      localStorage.removeItem('asoc');
    }
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

  private guardarTipoPermiso ( tipoPermiso: string ) {
    this.tipoPermiso = tipoPermiso;
    localStorage.setItem('tp', tipoPermiso);
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
    localStorage.removeItem('asoc');
    localStorage.removeItem('tp');
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

  leerAsociacion() {
    if ( localStorage.getItem('asoc') ){
      this.id_asociacion = Number.parseInt(localStorage.getItem('asoc'));
    } else {
      this.id_asociacion = 0;
    }
    return this.id_asociacion;
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

  leerTipoPermiso(){
    if(localStorage.getItem('tp')){
      return this.tipoPermiso = localStorage.getItem('tp');
    } else {
      return this.tipoPermiso = undefined;
    }
  }

  buscarPermiso(data: any){
    if(data.p_normal === 1){
      if(data.p_admin === 1){
        return 'p_normal_admin'
      } 
      return 'p_normal'

    } else if(data.p_tr === 1){
      if(data.p_admin === 1){
        return 'p_tr_admin'
      }
      return 'p_tr';

    } else {
      return '';
    }
  }

}
