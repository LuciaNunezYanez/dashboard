import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosNitService {

  constructor(public wsService: WebsocketService ) { }

  usuarioConectadoNIT( usuario: any) {
    this.wsService.emitirAlerta('loginNIT', usuario, function(usuariosComectados) {
      // console.log("Mis compañeros conectados son: ", usuariosComectados);
    });
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
