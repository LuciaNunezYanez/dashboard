import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { LoginService } from '../login.service';
import { NotificationDesktopService } from '../notification/notification-desktop.service';
import { UsuariosNitService } from '../usuarios/usuarios-nit.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  private socketStatusAnt;
  private cont = 0;

  alertas: Alerta[] = [];
  multimedia = [];
  imagenes = [];
  audios = [];
  videos = [];
  activaciones = [];
  valor = false;
  estatusAlerta = 0;

  audio;

  num_alertas_viejas: number = 0;
  num_alertas_nuevas: number = 0;

  latitudActual: number = 0.0;
  longitudActual: number = 0.0;
  tipo_ubicacion: string = '';

  ruta_nueva_alerta: string = "../../../assets/sounds/sonido_alarma_corto.mp3";
  ruta_nuevo_botonazo: string = "../../../assets/sounds/sonido_botonazo.mp3"

  constructor( private socket: Socket, private _notification: NotificationDesktopService) {
    this.checkStatus();
    this.escucharCambioUsuariosNIT();
    //this.alertasActualizadas();
    this.alertas = [];
  }

  // Verificar el estatus del servidor
  checkStatus() {
    console.log('CHECANDO ESTATUS');
    this.socket.on('connect', () => {
      // window.location.reload();
      if(this.cont === 1)
        window.location.reload();
      this.socketStatusAnt = this.socketStatus;
      this.socketStatus = true;
      this.alertasActualizadas();
      // if(this.socketStatusAnt === false && this.socketStatus){
      //   window.location.reload();
      //   this.socketStatusAnt = true;
      // }
      
    });

    this.socket.on('disconnect', () => {
      this.socketStatusAnt = this.socketStatus;
      this.socketStatus = false;
      if(this.cont != 1)
        this.cont = 1;
      
      // window.location.reload();
    });
  }

  removeCheckStatus(){
    console.log('CANCELÉ SUCRIPCION A: checkStatus');
    this.socket.removeListener('connect');
    this.socket.removeListener('disconnect');
  }

  // enviarLogin(){
  //   // Volver a enviar Login 
  //     let token_encriptado = this.auth.leerToken();
  //     var userLog = {
  //       token: token_encriptado,
  //       idEstacion: this.auth.leerEstacion(),
  //       sala: this.auth.leerSala()
  //     }
  //     this.usuariosService.usuarioConectadoNIT(userLog);
  // }

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
      // console.log(listaUsuariosNITActualizada);
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
      this.alertas.push(alertaAgregada);
      return alertaAgregada;
    })
  }

  alertasActualizadas(){
    console.log('SUSCRIPCION A ', 'alertasActualizadas' + localStorage.getItem('estacion'));
    this.socket.on('alertasActualizadas'+ localStorage.getItem('estacion'), (alertasActualizadas) => {   
      // console.log('A A <<---------'); 
      this.alertas = alertasActualizadas.alertas;
      this.num_alertas_viejas = this.num_alertas_nuevas;
      this.num_alertas_nuevas = this.alertas.length;
      // console.log('Alertas viejas: ', this.num_alertas_viejas);
      // console.log('Alertas nuevas: ', this.num_alertas_nuevas);

      if(this.num_alertas_nuevas > this.num_alertas_viejas){
        this.reproducirAudio(this.ruta_nueva_alerta);
        this._notification.mostrarNotificacion("ALERTA DE PÁNICO", "Nueva alerta recibida", "https://pbs.twimg.com/profile_images/2510152567/mqqyay4mvor5y9fnkf8k_400x400.gif");
      }
    });
  }

  removeListenerAlertasActualizadas(){
    console.log('CANCELÉ SUCRIPCION A: alertasActualizadas'+localStorage.getItem('estacion'));
    this.socket.removeListener('alertasActualizadas'+localStorage.getItem('estacion'));
  }

  public agregarMultimediaService(data: any){
    this.multimedia.push(data);
    this.filtrarMultimedia();
  }

  escucharNuevaImagen(idReporte: number){
    this.socket.on(`nuevaImagen${idReporte}`, (data) => {
      this.agregarMultimediaService(data);
      this.valor = true;
    })
  }

  removeListenerNuevaImagen(idReporte: number){
    this.socket.removeListener(`nuevaImagen${idReporte}`);
  }

  escucharNuevoAudio(idReporte: number){
    this.socket.on(`nuevoAudio${idReporte}`, (data) => {
      this.agregarMultimediaService(data);
      // console.log('Se recibió nuevo audio', data);
    })
  }

  removeListenerNuevoAudio(idReporte: number){
    this.socket.removeListener(`nuevoAudio${idReporte}`);
  }

  escucharNuevoVideo(idReporte: number){
    this.socket.on(`nuevoVideo${idReporte}`, (data) => {
      // console.log('LLEGÓ UN VIDEO');
      // console.log(data);
      const videos: any[] = data.videos;
      this.videos = videos.filter(dato => dato.tipo_archivo === 'video');
      // console.log(this.videos);
    });
  }

  removeListenerNuevoVideo(idReporte: number){
    this.socket.removeListener(`nuevoVideo${idReporte}`);
  }

  // No esta guardando en ningun lado la geolocalización
  escucharNuevaGeolocalizacion(idReporte: number){
    this.socket.on(`nuevaGeolocalizacion${idReporte}`, (data) => {
      this.latitudActual = data.lat_coord_reporte;
      this.longitudActual = data.lng_coord_reporte;
      this.tipo_ubicacion = data.tipo_ubicacion;
      console.log('EH RECIBIDO NUEVA GEOLOCALIZACIÓN');
    })
  }

  removeListenerGeolocalizacion(idReporte: number){
    this.socket.removeListener(`nuevaGeolocalizacion${idReporte}`);
  }

  escucharNuevoBotonazos(idReporte: number){
    this.socket.on(`listaBotonazos${idReporte}`, (data) => {
      this.activaciones = data.activaciones;
      this.reproducirAudio(this.ruta_nuevo_botonazo);
    });
  }

  escucharAlertaCancelada(idReporte: number){
    this.socket.on(`alertaCancelada${idReporte}`, (data) => {
      if(data.estatus){
        this.estatusAlerta = data.estatus;
      }
    });
  }

  removeListenerAlertaCancelada(idReporte: number){
    this.socket.removeListener(`alertaCancelada${idReporte}`);
    this.estatusAlerta = 0;
  }

  removeListenerBotonazos(idReporte: number){
    this.socket.removeListener(`listaBotonazos${idReporte}`);
    this.activaciones = [];
  }
  
  filtrarMultimedia(){
    this.imagenes = this.multimedia.filter(dato => dato.tipo_archivo === 'imagen');
    this.audios = this.multimedia.filter(dato => dato.tipo_archivo === 'audio');
    this.videos = this.multimedia.filter(dato => dato.tipo_archivo === 'video');
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

  reproducirAudio(ruta: string){
    const audio = new Audio();
    audio.src = ruta;
    audio.muted = false;
    audio.load();
    audio.play().then( () => {
      console.log('Reproducido con exito');
    }).catch( (err)=>{
      console.log("No se pudo repducir: ", err);
    });;
  }

  pausarAudio(){
    this.audio.pause();
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
  tipo_corp?: string, 
  botonazos?: number,

  tipo_incid_usuario?: string, 
  cuerpo_emerg_usuario?: string, 
  descrip_emerg_usuario?: string, 
  quien_emergencia?: string,
  abrev_grupo?: string
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


export interface DatosMedicos {
  id_dato_medico: number, 
  habla: number,
  escucha: number,
  lee: number,
  escribe: number,
  habla_LSM: number,
  toma_medicamentos: string, 
  peso: string, 
  estatura: string, 
  senas_particulares: string  

}

export interface ContactoEmergencia {
  id_contacto_emergencia?: number, 
  id_usuario_app_emergencia?: number, 
  nombre_contacto_emerg: string,
  telefono_contacto_emerg: string, 
  parentezco_contacto_emerg: string
}