import { Component, OnInit } from '@angular/core';

// Servicios 
import { WebsocketService } from '../../services/sockets/websocket.service';
import { AlertasNitService } from '../../services/sockets/alertas.service';
import { UsuariosNitService, Usuario } from '../../services/usuarios/usuarios-nit.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SwPush }  from  '@angular/service-worker';
import { mostrarOpcionesMenu } from 'src/app/utilities/login-util';
import { Alerta } from '../../services/utilidades/interfaces';

const VAPID_PUBLIC = 'BOa5kTrF7tS_ix4l2Mglhq1XQJK-mg4u7xfxKoFimw4dCYeOV8kMybuzD0W1aHjQr2QJcfLyJBs9XZEHKpN-zk8';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

public alertas;
idUsuarioNIT: number; 
public alerta: Alerta;
opcionesHabilitadas;

constructor(public wsService: WebsocketService, // VERIFICA LA CONEXION AL SERVIDOR (Connect)
            private alertasService: AlertasNitService,
            private usuariosService: UsuariosNitService,
            private auth: LoginService,
            private route: Router,
            _swPush: SwPush) {

  // this.wsService.alertasActualizadas();
  this.alertas = [];
  this.opcionesHabilitadas = mostrarOpcionesMenu(auth.leerTipoPermiso());
 }

ngOnInit() {
  let token_encriptado = this.auth.leerToken();
  this.idUsuarioNIT = Number.parseInt(this.auth.leerIDUsuario());
  var userLog = {
    token: token_encriptado,
    idEstacion: this.auth.leerEstacion(),
    sala: this.auth.leerSala()
  }
  //Método de uso temporal
  this.wsService.alertasActualizadas();
  this.usuariosService.usuarioConectadoNIT(userLog);
}

abrirNuevaPeticion(id_reporte: number, estatus_actual: number, nuevo_estatus: number){
  
  const data = {
    id_reporte, 
    id_user_cc: this.idUsuarioNIT,
    estatus_actual,
    nuevo_estatus: nuevo_estatus,
    idEstacion: this.auth.leerEstacion()
  }
  this.alertasService.alertaAbierta(data);
  
  this.abrirPeticion(id_reporte);
}

abrirPeticion(id_reporte: number){
  if(this.opcionesHabilitadas.reportetr){
    this.route.navigate(['reportetr', id_reporte]);
  } else {
    this.route.navigate(['reporte', id_reporte]);
  }
}


validarColor(id_usuario: number, estatus_actual: number) {
  if(id_usuario === this.idUsuarioNIT && estatus_actual === 1){
    return true;
  } else {
    return false;
  }
}
}


