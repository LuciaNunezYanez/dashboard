import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { LoginService } from '../services/login.service';
import { mostrarOpcionesMenu } from 'src/app/utilities/login-util';

@Injectable({
  providedIn: 'root'
})
export class TrGuard implements CanActivate {
  constructor( private auth: LoginService, private router: Router) {

  }

  canActivate(): boolean {
    const opcionesMenu = mostrarOpcionesMenu(this.auth.leerTipoPermiso());

    if(opcionesMenu.reportetr){
      return true;
    } else {
      this.router.navigateByUrl('/');
    }
  }
  
}
