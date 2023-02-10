import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { mostrarOpcionesMenu } from '../utilities/login-util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: LoginService, private router: Router) {

  }

  canActivate(): boolean {
    if(this.auth.estaAutenticado()){
      if(mostrarOpcionesMenu(this.auth.leerTipoPermiso()).valido === false){
        this.auth.cerrarSesion();
        this.router.navigateByUrl('/login');
        return true;
      }
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  
}
