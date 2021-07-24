import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';

import { Usuario } from '../services/usuarios/usuarios-nit.service';
import { LoginService } from '../services/login.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.scss']
})
export class RegisterComponent implements OnInit {

  usuario: Usuario;
  constructor(private auth: LoginService) { }

  ngOnInit() {
    this.usuario = new Usuario();
  }


  onSubmit(form: NgForm){
  
    console.log(this.usuario);

  
    if(form.invalid){
      Swal.fire({
        type: 'info',
        text: 'Datos incompletos'
      });
      return;
    }
    
    if(this.usuario.contrasena !== this.usuario.contrasena2){
      Swal.fire({
        type: 'info',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe((res: any) => {
      Swal.close();
      if(res.ok === true) {  
        Swal.fire({
          type: 'info',
          title: 'Éxito',
          text: `¡Usuario ${this.usuario.usuario} registrado!`
        });
        form.reset();
      }
    }, err => {
      Swal.fire({
        type: 'error',
        title: 'Error al registrar usuario',
        text: err.err
      });
    });

  }
}
