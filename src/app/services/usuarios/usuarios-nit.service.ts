import { Injectable } from '@angular/core';
import { WebsocketService } from '../sockets/websocket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosNitService {

  url = environment.wsUrl;

  constructor(public wsService: WebsocketService, private _http: HttpClient, private _login: LoginService) { }

  usuarioConectadoNIT( usuario: any) {
    this.wsService.emitirAlerta('loginNIT', usuario, function(usuariosComectados) {
      // console.log("Mis compañeros conectados son: ", usuariosComectados);
    });
  }  

  getUsuarios(){
    const sala = this._login.leerSala();
    const estacion = this._login.leerEstacion();
    const dpto = '911EMERGENCIAS';
    return this._http.get(`${this.url}/usuarionit/usuarios/${sala}/${estacion}/${dpto}`);
  }

  getUsuariosAsoc(){
    return this._http.get(`${this.url}/usuarionit/asociac/${this._login.leerAsociacion()}`);
  }

  addUsuario(data: Object){
    return this._http.post(`${this.url}/usuarionit/`, data);
  }

}

export class Usuario {
  id_user_cc: number;
  nombres: string;
  apellPat: string;
  apellMat: string;
  usuario: string; 
  tipo: number;
  depend?: string;
  sexo?: string;
  estatus?: number;
  sala?: string;
  contrasena?: string;
  contrasena2?: string;
}
