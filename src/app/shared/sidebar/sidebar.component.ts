import { Component, OnInit } from '@angular/core';

// Servicios 
import { WebsocketService, Alerta } from '../../services/sockets/websocket.service';
import { AlertasNitService } from '../../services/sockets/alertas.service';
import { UsuariosNitService, Usuario } from '../../services/sockets/usuarios-nit.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

public alertas;
idUsuarioNIT: number; 
public alerta: Alerta;

constructor(public wsService: WebsocketService, // VERIFICA LA CONEXION AL SERVIDOR (Connect)
            private alertasService: AlertasNitService,
            private usuariosService: UsuariosNitService,
            private auth: LoginService,
            private route: Router) {

  this.wsService.alertasActualizadas();
  this.alertas = [];
 }

ngOnInit() {
  let token_encriptado = this.auth.leerToken();
  this.idUsuarioNIT = Number.parseInt(this.auth.leerIDUsuario());
  var userLog = {
    token: token_encriptado,
    sala: 'NIT'
  }
  //Método de uso temporal
  this.usuariosService.usuarioConectadoNIT(userLog);
}

abrirNuevaPeticion(id_reporte: number, estatus_actual: number){
  const data = {
    id_reporte, 
    id_user_cc: this.idUsuarioNIT,
    estatus_actual
  }

  this.alertasService.alertaAbierta(data);
  this.route.navigate(['reporte', id_reporte]);
}

abrirPeticion(id_reporte: number){
  this.route.navigate(['reporte', id_reporte]);
}



validarColor(id_usuario: number, estatus_actual: number) {
  if(id_usuario === this.idUsuarioNIT && estatus_actual === 1){
    return true;
  } else {
    return false;
  }
}
}


