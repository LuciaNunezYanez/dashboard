import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class AlertasNitService {

  constructor( public wsService: WebsocketService) {

  }

  
  alertaAbierta(usuario: any) {

    this.wsService.emitirAlerta('alertaAbierta', usuario, (err: any, respuesta: any) => {
      if(err) {
        console.log('Ocurrio un error:', err);
      } else {  
        console.log('Todo salió bien:', respuesta);
      }
    });
  }

}
