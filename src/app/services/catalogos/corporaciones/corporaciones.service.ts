import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorporacionesService {

  url = environment.wsUrl;

  constructor( private _http: HttpClient) { }

  getCorporacionesAll(){
    return this._http.get(`${this.url}/corporaciones/all`)
  }
}
