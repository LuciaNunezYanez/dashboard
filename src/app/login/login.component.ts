import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { WebsocketService } from '../services/sockets/websocket.service';
import { AlertasNitService } from '../services/sockets/alertas.service';
import { Usuario } from '../services/sockets/usuarios-nit.service';
import { LoginService } from '../services/login.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();
  
  constructor(
      private router: Router,
      private auth: LoginService
      // public wsService: WebsocketService
      // public alertasNIT: AlertasNitService
      ) {

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
          text: 'Verifique sus datos'
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

}
