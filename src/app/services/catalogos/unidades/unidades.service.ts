import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

  url = environment.wsUrl;

  constructor( private _http: HttpClient) { }

  addUnidad(data: Object){
    return this._http.post(`${this.url}/unidades/`, data);
  }

  getUnidades(){
    return this._http.get(`${this.url}/unidades/`);
  }
  
  getUnidadesOnline(estatus: number){
    return this._http.get(`${this.url}/unidades/${estatus}`);
  }

  putAsignarUnidad(data: RequestAsignarUnidades){
    return this._http.put(`${this.url}/unidades/asignar`, data);
  }
}
