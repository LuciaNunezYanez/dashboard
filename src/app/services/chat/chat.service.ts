import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url = environment.wsUrl;

  constructor( private _http: HttpClient) { }

  changePermisoChat(tipo: String , estatus: number, id_reporte_chat: number){
    return this._http.post(`${this.url}/chat/changepermiso`, {tipo, estatus, id_reporte_chat});
  }
  
  getInfoChat(id_reporte: number){
    return this._http.get(`${this.url}/chat/${id_reporte}`);
  }

}
