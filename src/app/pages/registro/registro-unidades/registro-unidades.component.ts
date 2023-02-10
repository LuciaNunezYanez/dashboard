import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { title } from 'process';
import { CorporacionesService } from 'src/app/services/catalogos/corporaciones/corporaciones.service';
import { UnidadesService } from 'src/app/services/catalogos/unidades/unidades.service';
import { LocationService } from 'src/app/services/location/location.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-registro-unidades',
  templateUrl: './registro-unidades.component.html',
  styleUrls: ['./registro-unidades.component.scss']
})
export class RegistroUnidadesComponent implements OnInit {

  formaRegistro: FormGroup;
  hasLocalidad: Boolean;
  hasCorporacion: Boolean = false;

  corporaciones = [];
  estados = [];
  municipios = [];
  localidades = [];
  filtro_municipios = [];
  filtro_localidades = [];

  unidades = [];
  id_asociacion: number; // DEL LOGIN
  
  constructor(public fb: FormBuilder, private _login: LoginService, private router: Router, public _location: LocationService, private _corporaciones: CorporacionesService, private _unidades: UnidadesService) {
    
    if(this._login.leerAsociacion() != environment.asociacionEmergencias){ 
      Swal.close();
      Swal.fire('Error #13', '¡No cuenta con los permisos de registro!', 'error');
      this._login.cerrarSesion();
      this.router.navigate(['/login']);
    }

    this.id_asociacion = _login.leerAsociacion();
    this.inicializarFormaRegistro();
    this.getCorporaciones();
    this.getUbicaciones();
    this.reiniciarFormRegistro(0,10,0,0)

    this.getUnidades();
  }

  ngOnInit() {
  }

  inicializarFormaRegistro(){
    this.formaRegistro = this.fb.group({
      num_unidad:            ['', Validators.required],
      placas_unidad:         ['', Validators.required],
      id_corp:               [0], 
      corporacion:           [''],
      
      id_estado:             [10],
      id_municipio:          [0],
      id_localidad:          [0],
      localidad:             ['']
    });
  }

  reiniciarFormRegistro(id_corp, estado, municipio, localidad){
    this.formaRegistro.reset({
      num_unidad:            '',
      placas_unidad:         '', 
      id_corp:               id_corp,
      corporacion:           '',

      id_estado:             estado,
      id_municipio:          municipio,
      id_localidad:          localidad,
      localidad:             ''
    });
      
  }

  getCorporaciones(){
    this._corporaciones.getCorporacionesAll().subscribe( (corporaciones: any) => {
      if(corporaciones.corporaciones){
        this.corporaciones = corporaciones.corporaciones;
      }
    });
  }

  getUbicaciones(){
    this._location.getEstados().subscribe( (estados: any) => {
      if(estados.estados){
        this.estados = estados.estados;
      }
    });
    this._location.getMunicipios().subscribe( (municipios: any) => {
      if(municipios.municipios){
        this.municipios = municipios.municipios;
        this.onSelectEstado(10);
      }
    });
    this._location.getLocalidades().subscribe( (localidades: any) => {
      if(localidades.localidades){
        this.localidades = localidades.localidades;
      }
    });
  }

  getUnidades(){
    this._unidades.getUnidades().subscribe( (resp: any) => {
      if(resp.ok){
        this.unidades = resp.res;
      }
    });
  }

  onSelectEstado(id_estado){
    this.formaRegistro.get('id_estado').setValue(Number.parseInt(id_estado));
    this.formaRegistro.get('id_municipio').setValue(0);
    this.formaRegistro.get('id_localidad').setValue(0);
    this.filtro_localidades = [];
    this.filtro_municipios = this.municipios.filter( (municipio) => {
      return municipio.estado_id === Number(id_estado);
    });
  }


  onSelectMunicipio(id_municipio){
    this.formaRegistro.get('id_municipio').setValue(Number.parseInt(id_municipio));
    this.formaRegistro.get('id_localidad').setValue(0);
    this.filtro_localidades = this.localidades.filter((localidad) => {
      return localidad.municipio_id === Number(id_municipio);
    });
    if(Number.parseInt(id_municipio) === 291){
      this.formaRegistro.get('id_localidad').setValue(83874);
    }
  }

  onSelectLocalidad(id_localidad){
    this.formaRegistro.get('id_localidad').setValue(Number.parseInt(id_localidad));
    if(id_localidad > 0)
      this.hasLocalidad = false;
    const loc: any = this.localidades.filter((localidad) => {
      return localidad.id_localidades === Number(id_localidad);
    });
  }

  onSelectCorporacion(id_corporacion){
    this.formaRegistro.get('id_corp').setValue(Number.parseInt(id_corporacion));
    if(id_corporacion > 0)
      this.hasCorporacion = false;
  }

  submit() {
    if(this.formaRegistro.invalid){
      Object.values(this.formaRegistro.controls).forEach( control => {
        return control.markAsTouched();
      });
      this.hasLocalidad = this.comprobarLocalidad();
      this.hasCorporacion = this.comprobarCorporacion();
      Swal.fire('Atención', 'El formulario es INVÁLIDO, ¡Por favor llene los campos obligatorios marcados en rojo!', 'warning');
      return;
    } else {
      this.hasLocalidad = this.comprobarLocalidad();
      if(this.hasLocalidad){
        Swal.fire('Atención', 'El formulario es INVÁLIDO, ¡Seleccione localidad!', 'warning');
        return;
      }
    }
    Swal.showLoading();

    this._unidades.addUnidad(this.formaRegistro.value).subscribe( (resp: any) => {
      Swal.close();
      if(resp.ok){
        this.reiniciarFormRegistro(
          this.formaRegistro.get('id_corp').value,
          this.formaRegistro.get('id_estado').value,
          this.formaRegistro.get('id_municipio').value,
          this.formaRegistro.get('id_localidad').value
        );
        this.hasCorporacion = false;
        this.hasLocalidad = false; 
        Swal.fire('Atención', resp.res.resp, 'success');

        // TODO: Traer tabla con unidades actualizada
        this.getUnidades();
      } else {
        Swal.fire('Atención', resp.res.resp, 'error');
      }
      
    })
  }

  comprobarLocalidad(): Boolean {
    return ( Number.parseInt(this.formaRegistro.get('id_localidad').value) === 0 ) ? true : false; 
  }
  comprobarCorporacion(): Boolean {
    return ( Number.parseInt(this.formaRegistro.get('id_corp').value) === 0 ) ? true : false; 
  }

  // is INVALID 
  get isInvalidUnidad(){
    return (this.formaRegistro.get('num_unidad').value === '' && this.formaRegistro.get('num_unidad').touched)
  }
  get isInvalidPlacas(){
    return (this.formaRegistro.get('placas_unidad').value === '' && this.formaRegistro.get('placas_unidad').touched)
  }
  get getValidLocalidad(){
    return this.hasLocalidad;
  }
  get getValidCorporacion(){
    return this.hasCorporacion;
  }

}
