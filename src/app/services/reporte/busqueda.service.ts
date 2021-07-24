import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  
  url = environment.wsUrl;

  constructor(private http: HttpClient) { }


  getReporteFull(id_reporte: number){
    return this.http.get(`${this.url}/reporte/full/${id_reporte}`);
  }

  getBusquedaReportes(data: any){
    return this.http.post(`${this.url}/reporte/filtro`, data);
  }
}
