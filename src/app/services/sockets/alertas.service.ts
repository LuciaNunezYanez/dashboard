import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AlertasNitService {

  constructor( public wsService: WebsocketService, 
                private route: Router) {
  }

  alertaAbierta(usuario: any) {
    this.wsService.emitirAlerta('alertaAbierta', usuario, (err: any, respuesta: any) => {
      if(err) {
        console.log('Ocurrio un error al abrir alerta:', err);
      } else {  
        // console.log('Todo salió bien al abrir alerta:', respuesta);
      }
    });
  }

  alertaCerrada(data: any){
    this.wsService.emitirAlerta('alertaCerrada', data, (err: any, respuesta: any) => {
      if(err) {
        console.log(err);
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: err.resp
        });
        this.route.navigate(['/login']);
        
      } else {  
        console.log(respuesta);
        
        Swal.fire({
          type: 'success',
          title: 'Éxito', 
          text: respuesta.resp
        });
        this.route.navigate(['']);

      }
    });
  }
  
}
