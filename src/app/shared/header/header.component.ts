import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/sockets/websocket.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(public _ws: WebsocketService, public _login: LoginService, private _wsService: WebsocketService) { }

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
