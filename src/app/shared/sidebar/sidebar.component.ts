import { Component, OnInit } from '@angular/core';

// Servicios 
import { WebsocketService, Alerta } from '../../services/sockets/websocket.service';
import { AlertasNitService } from '../../services/sockets/alertas.service';
import { UsuariosNitService, Usuario } from '../../services/sockets/usuarios-nit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  public alertas;
  idUsuarioNIT = 4;
  public alerta: Alerta;

  constructor(public wsService: WebsocketService, // VERIFICA LA CONEXION AL SERVIDOR (Connect) (Genera clientes)
              public alertasService: AlertasNitService,
              public usuariosService: UsuariosNitService,
              private route: Router) {

    this.wsService.alertasActualizadas();
    this.alertas = [];
    
   }

  ngOnInit() {
    var userLog:Usuario = {
      id_user_cc: 4,
      usuario: 'anadi1997@hotmail.com', // email
      nombres: 'NOMBRE',  
      sala: 'NIT',
      apellPat: 'PAT',  
      apellMat: 'MAT',  
      tipo: 1,  
      depend: 'SSP', 
      sexo: 'F'
    }

    //Método de uso temporal
    this.usuariosService.usuarioConectadoNIT(userLog);
    // Toma la alerta 289 y se las quita a todos
    // this.wsService.escucharNuevaAlerta();
    // this.wsService.alertasActualizadas();
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
    let logueado = false;
    if(id_usuario === this.idUsuarioNIT && estatus_actual === 1){
      logueado = true;
    } else {
      logueado = false;
    }
    return logueado;
  }
}



