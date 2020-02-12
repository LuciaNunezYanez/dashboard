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
  styles: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public alertas;
  idUsuarioNIT = 4; // Cambiar ID por el del usuario que se logeo
  public alerta: Alerta;

  constructor(public wsService: WebsocketService, // VERIFICA LA CONEXION AL SERVIDOR (Connect) (Genera clientes)
              private alertasService: AlertasNitService,
              private usuariosService: UsuariosNitService,
              private auth: LoginService,
              private route: Router) {

    this.wsService.alertasActualizadas();
    this.alertas = [];
   }

  ngOnInit() {
    let token_encriptado = this.auth.leerToken();
    var userLog = {
      token: token_encriptado,
      sala: 'NIT'
    }
    //Método de uso temporal
    this.usuariosService.usuarioConectadoNIT(userLog);
    // Toma la alerta 289 y se las quita a todos
  }

  abrirPeticion(id_reporte: number, estatus_actual: number){
    const data = {
      id_reporte, 
      id_user_cc: this.idUsuarioNIT,
      estatus_actual
    }
  
    this.alertasService.alertaAbierta(data);
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



