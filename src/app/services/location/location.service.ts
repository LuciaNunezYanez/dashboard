import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  url = environment.wsUrl;

  constructor( private _http: HttpClient) { }

  getEstados(){
    return this._http.get(`${this.url}/estados`);
  }

  getMunicipios(){
    return this._http.get(`${this.url}/municipios`);
  }

  getLocalidades(){
    return this._http.get(`${this.url}/localidades`);
  }
}
