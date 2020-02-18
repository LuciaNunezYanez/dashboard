import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from '../services/sockets/usuarios-nit.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = environment.wsUrl;
  userToken: string;
  idUsuarioNIT: string;

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
          
          // Guardar la información del usuario 
          // resp.usuario
          this.guardarToken(resp.token);
          this.guardarIDUsuario(resp.id_usuario);
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
    console.log('El cuerpo que enviaré es:', body);
    return this.http.post(`${this.url}/usuarionit`, body);
  }

  // =========================================
  // GUARDAR 
  // =========================================
  private guardarToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  private guardarIDUsuario ( idUsuario: string ) {
    this.idUsuarioNIT = idUsuario;
    localStorage.setItem('idUsuario', idUsuario);
  }

  // =========================================
  // ESTA AUTENTICADO (Validar la fecha del token)
  // =========================================
  estaAutenticado(): Boolean{
    return this.userToken.length > 2;
  }

  // =========================================
  // SIGUE DESARROLLAR EL CIERRE DE SESION
  // =========================================
  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('idUsuario');
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

  leerIDUsuario() {
    if( localStorage.getItem('idUsuario')){
      this.idUsuarioNIT = localStorage.getItem('idUsuario');
    } else{
      this.idUsuarioNIT = '';
    }
    return this.idUsuarioNIT;
  }

}
