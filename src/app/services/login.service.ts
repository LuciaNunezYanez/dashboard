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

  constructor( private http: HttpClient) {
    this.leerToken();
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
        // Guardar el token recibido
        if (resp.token) {
          console.log(resp);
          this.guardarToken(resp.token);
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
  // GUARDAR TOKEN
  // =========================================
  private guardarToken( idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  // =========================================
  // ESTA AUTENTICADO
  // =========================================
  estaAutenticado(): Boolean{
    return this.userToken.length > 2;
  }

  // =========================================
  // SIGUE DESARROLLAR EL CIERRE DE SESION
  // =========================================
  cerrarSesion() {
    localStorage.removeItem('token'); // CREO 
    // Eliminar token 
  }

  // =========================================
  // LEER TOKEN
  // =========================================
  leerToken() {
    if ( localStorage.getItem('token') ){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }
}
