import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  alertas: Alerta[] = [];
  multimedia = [];
  imagenes = [];
  audios = [];
  valor = false;

  constructor( private socket: Socket ) {
    this.checkStatus();
    this.escucharCambioUsuariosNIT();
    this.alertas = [];
  }

  // Verificar el estatus del servidor
  checkStatus() {
    this.socket.on('connect', () => {
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      this.socketStatus = false;
    });
  }

  emitirAlerta(evento: string, payload?: any, callback?: Function) {
    this.socket.emit(evento, payload, callback);
  }

  /*
  *
  * Escuchadores USUARIOS NIT 
  * 
  */ 
  // Vulnerabilidad 
  escucharCambioUsuariosNIT() {
    this.socket.on('listaUsuariosNIT', function( listaUsuariosNITActualizada ){
      console.log(listaUsuariosNITActualizada);
    });
  }


  /*
  *
  * Escuchadores ALERTAS 
  * 
  */ 
  // Ya no se va a utilizar 
  escucharNuevaAlerta() {
    this.socket.on('alertaAgregada', ( alertaAgregada ) => {
      console.log('La alerta agregada es: ', alertaAgregada);  
      this.alertas.push(alertaAgregada);
      return alertaAgregada;
    })
  }

  alertasActualizadas(){
    this.socket.on('alertasActualizadas', (alertasActualizadas) => {
      this.alertas = alertasActualizadas.alertas;
      // console.log('Las alertas actualizadas son: ', alertasActualizadas);
    });
  }

  escucharNuevaImagen(idReporte: number){
    this.socket.on(`nuevaImagen${idReporte}`, (data) => {
      this.agregarMultimediaService(data);
      // console.log('Se recibió nueva imagen', data);
      this.valor = true;
    })
  }

  removeListenerNuevaImagen(idReporte: number){
    this.socket.removeListener(`nuevaImagen${idReporte}`);
  }

  public agregarMultimediaService(data: any){
    this.multimedia.push(data);
    this.filtrarMultimedia();
  }

  escucharNuevoAudio(idReporte: number){
    this.socket.on(`nuevoAudio${idReporte}`, (data) => {
      this.agregarMultimediaService(data);
      // console.log('Se recibió nuevo audio', data);
    })
  }

  escucharNuevaGeolocalizacion(idReporte: number){
    this.socket.on(`nuevaGeolocalizacion${idReporte}`, (data) => {
      console.log('Nueva geolocalizacion; ', idReporte);
      console.log(data);
    })
  }

  removeListenerNuevoAudio(idReporte: number){
    this.socket.removeListener(`nuevoAudio${idReporte}`);
  }

  removeListenerGeolocalizacion(idReporte: number){
    this.socket.removeListener(`nuevaGeolocalizacion${idReporte}`);
  }

  filtrarMultimedia(){
    this.imagenes = this.multimedia.filter(dato => dato.tipo_archivo === 'imagen');
    this.audios = this.multimedia.filter(dato => dato.tipo_archivo === 'audio')
    // console.log('Mi multimedia es: ', this.multimedia);
    // console.log('Array imagenes: ', this.imagenes);
    // console.log('Array audios: ', this.audios);
  }
  // Debe traer todos los datos de una alerta en especifico
  obtenerAlerta(idReporte: number, idUsuario: number){
    let alerta = this.alertas.filter((alerta: any ) => {
      return alerta.id_reporte == idReporte && alerta.id_user_cc == idUsuario;
    });

    return alerta;
  }

}

// Columnas iguales a la base de datos
export interface Alerta {
  id_reporte: number,
  id_user_cc: number,
  id_com_reporte: number,
  id_user_app?: number,
  id_unidad_rep?: number,
  fecha_hora_docum?: string,
  fecha_hora_ataq?: string,
  tipo_incid?: number,
  descrip_emerg?: string,
  clasificacion_emerg?: number,
  estatus_actual?: number,
  cierre_conclusion?: string,
  id_unidad?: number,
  id_corp?: number,
  num_unidad?: string,
  id_corporacion?: number,
  tipo_corp?: string
}

export interface Comercio { 
  id_comercio: number, 
  id_dir_comercio: number,
  num_empleados?: number,
  nombre_comercio?: string,
  giro?: string,
  telefono_fijo?: string,
  folio_comercio?: number,
  razon_social?: string,
  id_direccion?: number,
  calle?: string,
  numero?: string,
  colonia?: string,
  cp?: number,
  entre_calle_1?: string,
  entre_calle_2?: string,
  fachada?: string,
  id_localidad: number,
  lat_dir?: number,
  lgn_dir?: number,
  id_localidades: number,
  municipio_id?: number,
  clave_localidad?: string,
  nombre_localidad?: string,
  latitud?: number,
  longitud?: number,
  altitud?: string,
  carta?: string,
  ambito?: string,
  poblacion?: number,
  masculino?: number,
  femenino?: number,
  viviendas?: number,
  lat?: number,
  lng?: number,
  activo_localid?: number,
  id_municipios: number,
  estado_id?: number,
  clave_municipio?: string,
  nombre_municipio?: string,
  activo_mun?: number,
  id_estados: number,
  clave_estado?: string,
  nombre_estado?: string,
  abrev?: string,
  activo_ests?: number

}

export interface UsuarioComercio {
  id_usuarios_app: number ,
  id_com_user_app: number, 
  nombres_usuarios_app: string,
  apell_pat: string,
  apell_mat?: string,
  fecha_nacimiento?: string,
  sexo_app?:string,
  padecimientos?: string,
  tel_movil?: string,
  alergias?: string,
  tipo_sangre?: string,
  estatus_usuario?: number,
  id_comercio?: number,
  id_dir_comercio?: number,
  num_empleados?: number,
  nombre_comercio?: string,
  giro?: string,
  telefono_fijo?: string,
  folio_comercio?: number,
  razon_social?: string

}

export interface Multimedia {
  id_multimedia: number,
  fechahora_captura: string,
  tipo_archivo: string,
  ruta: string,
  id_reporte_mult: number
}