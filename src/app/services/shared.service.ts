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

  getDataCoordenadas( id_alerta ) {
    return this.http.get(`${ this.URL_API }/coordenadas/${ id_alerta }`);
  }

  getDataActivaciones ( id_alerta ) {
    return this.http.get(`${this.URL_API}/activaciones/${id_alerta}`);
  }

  getDireccionComercio(id_comercio: number){
    return this.http.get(`${this.URL_API}/direccion/${id_comercio}`);
  }

  getDatosMedicos(id_medico: number){
    return this.http.get(`${this.URL_API}/datosmedicos/${id_medico}`);
  }

  getContactoEmergencia(id_usuario: number){
    return this.http.get(`${this.URL_API}/contactoemerg/${id_usuario}`);
  }

  sendMessage(id_usuario: number, titulo: string, descripcion: string){
    console.log('SEND MESSAGE');
    return this.http.post(`${this.URL_API}/mensajes/${id_usuario}`, {titulo, descripcion});
  }
}
