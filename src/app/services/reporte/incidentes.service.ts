import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentesService {

  url = environment.wsUrl;
  
  constructor( private http: HttpClient) { 

  }

  getClasificacion(){
    return this.http.get(`${this.url}/incidentes/clasificacion`);
  }
  
  getSubclasificacion(){
    return this.http.get(`${this.url}/incidentes/subclasificacion`);
  }

  getIncidentes(){
    return this.http.get(`${this.url}/incidentes/incidentes`);
  }

}
