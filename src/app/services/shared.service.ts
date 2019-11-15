import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private URL_API = environment.wsUrl;
  constructor(private http: HttpClient) { }

  getDataReporte( id_alerta ) {
    return this.http.get(`${ this.URL_API }/reporte/${ id_alerta }`);
  }

  getDataComercio( id_comercio ) {
    return this.http.get(`${ this.URL_API }/comercio/${ id_comercio }`);
  }
  getDataUsuarioComercio( id_usuario) {
    return this.http.get(`${this.URL_API}/usuariocomercio/${id_usuario}`);
  }


  getDataMultimedia( id_alerta ) {
    return this.http.get(`${ this.URL_API }/multimedia/reporte/${ id_alerta }`);
  }

  getDataAudio( id_alerta ) {
    return this.http.get(`${ this.URL_API }/audio/${ id_alerta }`);
  }
}
