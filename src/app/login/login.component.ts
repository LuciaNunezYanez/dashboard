import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { WebsocketService } from '../services/sockets/websocket.service';
import { AlertasNitService } from '../services/sockets/alertas.service';
import { Usuario } from '../services/usuarios/usuarios-nit.service';
import { LoginService } from '../services/login.service';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { NotificationDesktopService } from '../services/notification/notification-desktop.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();
  
  constructor(
      private router: Router,
      private auth: LoginService,
      private _notification: NotificationDesktopService
      // public wsService: WebsocketService
      // public alertasNIT: AlertasNitService
      ) {
        this.validarNotification();
  }

  ngOnInit() {
  }

  // =====================
  // INICIAR SESIÓN
  // =====================
  login(form: NgForm) {
    if (form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    // FORMULARIO VALIDO
    this.auth.login(this.usuario).subscribe( (resp: any) => {
      Swal.close();
      if(resp.resp === 'Usuario inactivo') {
        return Swal.fire({
          type: 'error',
          title: 'Error al autenticar',
          text: 'Contacte al administrador'
        });
      }
      if(resp.ok === false) { 
        Swal.fire({
          type: 'error',
          title: 'Error al autenticar',
          text: 'Verifique sus datos y/o privilegios de acceso.'
        });
      }
      // =================
      // LOG IN EXITOSO 
      // =================
      if(resp.ok === true) { 
        Swal.fire({
          type: 'info',
          title: 'Exito al autenticar',
          text: '¡Bienvenido!'
        });
        // reporte
        this.router.navigate(['/']);
      }
    }, (err) => {
      console.log(err);
      Swal.fire({
        type: 'error',
        title: 'Error al autenticar',
        text: err.statusText
      });
    });
  } 

  validarNotification(){
    if(Notification.permission === "granted"){
      console.log("Permiso concedido");
      // this._notification.mostrarNotificacion("ALERTA DE PÁNICO",
      //     "Permiso concedido para mostrar notificaciones en el escritorio.",
      //     "https://cdn.icon-icons.com/icons2/1506/PNG/512/emblemok_103757.png");

    } else if(Notification.permission === "default"){
      Notification.requestPermission().then(permission => {
        console.log('PERMISSION: ' + permission);
        if(permission === "granted"){
          this._notification.mostrarNotificacion("ALERTA DE PÁNICO",
          "Permiso concedido para mostrar notificaciones en el escritorio.",
          "https://cdn.icon-icons.com/icons2/1506/PNG/512/emblemok_103757.png");
        }
      })
    }
  }

 
}
