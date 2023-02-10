import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/sockets/websocket.service';
import { LoginService } from '../../services/login.service';
import { mostrarOpcionesMenu } from '../../utilities/login-util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  opcionesHabilitadas;

  constructor(public _ws: WebsocketService, public _login: LoginService, private _wsService: WebsocketService) {
    this.opcionesHabilitadas = mostrarOpcionesMenu(_login.leerTipoPermiso());
  }

  ngOnInit() {
  }

  cerrarSesion() {
    this._wsService.removeListenerAlertasActualizadas();
    this._login.cerrarSesion();
  }

  comprobarSockets(){
    console.log('Comprobaré los sockets.');

    
  }
}
