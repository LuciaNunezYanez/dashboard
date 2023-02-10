import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import Swal from 'sweetalert2'
import { LoginService } from '../../../services/login.service';
import { UnidadesService } from '../../../services/catalogos/unidades/unidades.service';
import { UsuariosNitService } from '../../../services/usuarios/usuarios-nit.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.scss']
})
export class RegistroUsuariosComponent implements OnInit {


  formaRegistro: FormGroup;
  unidades = [];
  usuarios = [];
  privilegios = [
    {
      val: 1, 
      id: 'p_normal', 
      tipo: 'Normal web'
    },
    {
      val: 1, 
      id: 'p_tr', 
      tipo: 'Tiempo real web'
    },
    { 
      val: 1, 
      id: 'p_normal_admin', 
      tipo: 'Normal y administrador web'
    }, 
    { 
      val: 1, 
      id: 'p_tr_admin', 
      tipo: 'Tiempo real y administrador web'
    }, 
    {
      val: 1, 
      id: 'p_app_emerg', 
      tipo: 'Aplicación móvil'
    }];

  id_asociacion: number; // DEL LOGIN
  
  constructor(public fb: FormBuilder, private _login: LoginService, private router: Router, 
    private _unidades: UnidadesService, private _usuario: UsuariosNitService) {
    if(this._login.leerAsociacion() != 2){ 
      Swal.close();
      Swal.fire('Error #13', '¡No cuenta con los permisos de registro!', 'error');
      this._login.cerrarSesion();
      this.router.navigate(['/login']);
    }

    this.id_asociacion = _login.leerAsociacion();
    this.inicializarFormaRegistro();
    this.getUnidades();
    this.getUsuariosAsoc();
  }

  ngOnInit() {
  }

 
  inicializarFormaRegistro(){
    this.formaRegistro = this.fb.group({
      nombres:               ['', [Validators.required, Validators.maxLength(50)]],
      apellPat:              ['', [Validators.required, Validators.maxLength(40)]],
      apellMat:              ['', Validators.maxLength(40)], 
      usuario:               ['', [Validators.required, Validators.maxLength(30)]],
      contrasena:            ['', [Validators.required, Validators.maxLength(30)]],
      id_unidad:             [0],
      sexo:                  [''],
      
      tipo:                  [1],
      estatus:               [1],
      depend:                [''], 
      // Tal vez arriba sea si es policia municipal, etc.. 

      sala:                  [environment.salaEmergencias],
      estacion:              [environment.estacionEmergencias],
      asociacion:            [environment.asociacionEmergencias],
      dpto:                  [environment.dptoEmergencias],

      privilegio:            ['p_normal']
    });
  }

  reiniciarFormRegistro(){
    this.formaRegistro.reset({
      nombres:               [''],
      apellPat:              [''],
      apellMat:              [''], 
      usuario:               [''],
      contrasena:            [''],
      id_unidad:             [0],
      sexo:                  [''],
      
      tipo:                  [1],
      estatus:               [1],
      depend:                [''],

      sala:                  [environment.salaEmergencias],
      estacion:              [environment.estacionEmergencias],
      asociacion:            [environment.asociacionEmergencias],
      dpto:                  [environment.dptoEmergencias],

      privilegio:            ['p_normal']
    });
  }

  getUnidades(){
    this._unidades.getUnidades().subscribe( (resp: any) => {
      if(resp.ok){
        this.unidades = resp.res;
      }
    });
  }

  getUsuariosAsoc(){
    this._usuario.getUsuariosAsoc().subscribe((resp: any)=>{
      if(resp.usuarios){
        this.usuarios = resp.usuarios;
      }
    });
  }


  submit(){
    if(!this.formaRegistro.valid){
      return Swal.fire('Atención', 'Ingrese todos los campos obligatorios', 'warning');
    }
    
    this._usuario.addUsuario(this.formaRegistro.value).subscribe((resp: any)=> {
      console.log('RESPUESTA AL AGREGAR USUARIO');
      console.log(resp);
      if(resp.ok){
        this.reiniciarFormRegistro();
        Swal.fire('Atención', 'Usuario registrado con éxito.', 'success');
        this.getUsuariosAsoc();
      } else {
        Swal.fire('Atención', 'No se pudo registrar al usuario, recargue la página e intente de nuevo', 'error');
      }
    });
    
  }

}
