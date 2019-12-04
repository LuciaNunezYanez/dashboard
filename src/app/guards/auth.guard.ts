import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor( private auth: LoginService, private router: Router) {

  }

  canActivate(): boolean {
    if(this.auth.estaAutenticado()){
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  
}
