import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { Alerta, Comercio, UsuarioComercio, Multimedia, DatosMedicos, ContactoEmergencia } from '../../../services/utilidades/interfaces';
import { mostrarAlertaError } from '../../../utilities/utilities';
import { LoginService } from '../../../services/login.service';
import { IncidentesService } from '../../../services/reporte/incidentes.service';
import { AlertasNitService } from '../../../services/sockets/alertas.service';
import Swal from 'sweetalert2';
import { DireccionService } from '../../../services/direccion/direccion.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { mostrarOpcionesMenu } from 'src/app/utilities/login-util';
import { UnidadesService } from 'src/app/services/catalogos/unidades/unidades.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Chat } from 'src/app/services/utilidades/interfaces';
import { WebsocketService } from '../../../services/sockets/websocket.service';

@Component({
  selector: 'app-reporte-tr',
  templateUrl: './reporte-tr.component.html',
  styleUrls: ['./reporte-tr.component.scss']
})
export class ReporteTrComponent implements OnInit {

  private id_reporte:number = 0;
  private id_direccion_usuario: number = 0;
  public data_reporte: Alerta;
  public data_comercio: Comercio;
  public data_usuario_comercio: UsuarioComercio;
  public data_medico: DatosMedicos;
  private data_multimedia: Multimedia[];
  public contactos_emergencia: [ContactoEmergencia];
  public chat: Chat;

  public imagenes: any[] = [];
  public audios: any[] = [];
  public chats: any[] = [ {
    id_chat: 1, 
    id_user: 1, 
    mensaje: 'Hola', 
    fecha: '22/11/2021 09:46'
  } , {
    id_chat: 2, 
    id_user: 38, 
    mensaje: 'Que onda', 
    fecha: '22/11/2021 09:46'
  } ];

  // Información general del reporte 
  private id_user_cc: number = 0; 
  private id_com_reporte: number = 0; 
  private id_user_app: number = 0; 

  // PARA EL FORMULARIO DE INCIDENTES
  selectedClasificacion = 0;
  selectedSubclasificacion = 0;
  selectedIncidente = 0;

  clasificacion = [];
  subclasificacion = [];
  incidentes = [];

  filtro_subclasificacion = [];
  filtro_incidentes = [];

  // Filtros para asignar unidad
  filtro_corporaciones = [];
  filtro_unidades = [];
  filtro_oficiales = [];

  ultima_suscripcion = 0;

  latitudComercio:number = 0.0;
  longitudComercio:number = 0.0;

  // latitudActual: number = 0.0;
  // longitudActual: number = 0.0;
  fechaCoordenadas: String = "";
  direccionActual: any = {};
  direccionRegistrada: string = "";

  // Variables para agmap
  ceroCoordenadas: boolean = false;
  tengoCoordenadas: number = 0;

  nocomercio: boolean = false;
  tipo_grupo: string = '';
  //distancia: number = 0.0;
  //metrosKilometros: any = "";
  opcionesHabilitadas;
  chatHabilitado: Boolean = false;
  unidadesOnline = [];
  formaAsignacion: FormGroup;

  constructor(private routerActive: ActivatedRoute,
    private obtener: SharedService, 
    private auth: LoginService,
    public wsService: WebsocketService, 
    private incidentesService: IncidentesService, 
    private alertasService: AlertasNitService, 
    public _direccion: DireccionService,
    private route: Router, 
    public _utl: UtilidadesService,
    private _unidades: UnidadesService, 
    private fb: FormBuilder, 
    private _chat: ChatService) {

    // Mostrar las opciones correspondientes al usuario
    this.opcionesHabilitadas = mostrarOpcionesMenu(auth.leerTipoPermiso());
    this.crearFormaAsignacion();

    // OBTENER LA LISTA DE INCIDENTES DE LA BD 
    this.getIncidentesBD();
    this.getUnidadesOnline(1);
        
    // Suscripción al cambio de parametros en la URL 
    this.routerActive.params.subscribe( (data: any) => {
      try {
        this.id_reporte = parseInt(data.id_reporte);
      } catch (error) {
        mostrarAlertaError('Folio de reporte incorrecto', 'Verifique sus datos');
      } 
      
      // console.log(Number.isInteger(this.id_reporte));
      // return;

      if(!this.id_reporte || this.id_reporte <= 0 || !Number.isInteger(this.id_reporte)){
        mostrarAlertaError('Folio de reporte incorrecto', 'Verifique sus datos');
        return;
      }
      
      // Traer los datos del reporte (1)
      this.obtener.getDataReporte(this.id_reporte).subscribe( (data_reporte: any) => {
        this.data_reporte = data_reporte.reporte[0];
        if(this.data_reporte === undefined){
          mostrarAlertaError('Folio de reporte incorrecto', 'Verifique sus datos');
        }
        else {
          console.log('---------->');
          console.log(this.data_reporte);

          // console.log(this.data_reporte);

          // Cancelar la suscripción anterior
          this.wsService.removeListenerNuevaImagen(this.ultima_suscripcion);
          this.wsService.removeListenerNuevoAudio(this.ultima_suscripcion);  
          this.wsService.removeListenerNuevoVideo(this.ultima_suscripcion); 
          this.wsService.removeListenerGeolocalizacion(this.ultima_suscripcion);
          this.wsService.removeListenerBotonazos(this.ultima_suscripcion);
          this.wsService.removeListenerAlertaCancelada(this.ultima_suscripcion);      

          // Suscribirse a los cambios de una imagen y audio
          this.ultima_suscripcion = this.id_reporte;
          this.wsService.escucharNuevaImagen(this.id_reporte);
          this.wsService.escucharNuevoAudio(this.id_reporte);
          this.wsService.escucharNuevoVideo(this.id_reporte);
          this.wsService.escucharNuevaGeolocalizacion(this.id_reporte);
          this.wsService.escucharNuevoBotonazos(this.id_reporte);
          this.wsService.escucharAlertaCancelada(this.id_reporte);

          this.cargarDatosReporte(); 
          // Traer los datos del comercio (2)
          if(this.id_com_reporte === 0 ){
            mostrarAlertaError('Folio de comercio incorrecto', 'Verifique sus datos');
          } 
            // else if (this.id_com_reporte === 1){
            // this.nocomercio = true;
            // console.log('Es alerta de genero ');
            // Ignorar datos del comercio 
            // Traer direccion de la persona
            // Ignorar latitud y longitud ya que no está registrada en la dirección
            // Válidar las coordenadas 
            // }
           else {
            this.nocomercio = true;
            // this.tipo_grupo = '';

            this.obtener.getDataComercio(this.id_com_reporte).subscribe( (data_comercio: any) => {
              this.data_comercio = data_comercio.comercio[0];
              this.latitudComercio = this.data_comercio.lat_dir;
              this.longitudComercio = this.data_comercio.lgn_dir;
              //console.log('DATA COMERCIO ', this.data_comercio);

              // Geocodificar coordenadas a dirección completa
              if(this.latitudComercio != 0.0){
                this._direccion.geocodificarDireccion((this.latitudComercio).toString(),  (this.longitudComercio).toString()).subscribe(( data: any) => {
                  if (data.status === 'OK') {
                    this.direccionRegistrada = data.results[0].formatted_address;
                  }
                });
              }
            });
          }

          // Traer los datos del usuario comercio (3)
          if(this.id_user_app === 0){
            mostrarAlertaError('Folio de usuario comercio incorrecto', 'Verifique sus datos');
          } else {
            this.obtener.getDataUsuarioComercio(this.id_user_app).subscribe( (data_usuario_comercio  : any) => {
              this.data_usuario_comercio = data_usuario_comercio.resp;
              this.tipo_grupo = this.data_usuario_comercio.nombre_comercio;
              this.id_direccion_usuario = data_usuario_comercio.resp.id_direccion_app;
              // console.log('Data usuario: ', data_usuario_comercio);
              if(this.id_direccion_usuario > 1 ){
                this.obtener.getDireccionComercio(this.id_direccion_usuario).subscribe( (data_direccion: any) => {
                  this.data_comercio = data_direccion.direccion;
                  // console.log(data_direccion);
                });
              }

              const id_medico: number = data_usuario_comercio.resp.id_datos_medicos;
              if(id_medico != null && id_medico != undefined && id_medico > 0){
                this.obtener.getDatosMedicos(id_medico).subscribe( (datos_medicos: any) => {
                  // console.log('LOS DATOS MÉDICOS SON:', datos_medicos);
                  if(datos_medicos.ok){
                    this.data_medico = datos_medicos.datos_medicos;
                  } else {
                    datos_medicos = undefined;
                  }
                })
              } 
            });

            // DATOS DEL CONTACTO DE EMERGENCIA 
            this.obtener.getContactoEmergencia(this.id_user_app).subscribe( (contacto_emergencia: any) => {
              if(contacto_emergencia.ok){
                this.contactos_emergencia = contacto_emergencia.contactos;
                // console.log(this.model_contacto_emergencia);
              } else {
                this.contactos_emergencia = undefined;
              }
            });
          }
          
          // Obtener el número de activaciones por reporte
          this.obtener.getDataActivaciones(this.id_reporte).subscribe( (data_activaciones: any) => {
            if(data_activaciones.ok){
              this.wsService.activaciones = [];
              this.wsService.activaciones = data_activaciones.activaciones;
              // console.log(`Las activaciones del reporte ${this.id_reporte} son:`, this.wsService.activaciones );
            }  
          });

          // Traer los datos de la multimedia (4)
          this.obtener.getDataMultimedia(this.id_reporte).subscribe( (data_multimedia: any) => {
            // console.log('LA MULTIMEDIA RECIBIDA: ');
            // console.log(data_multimedia);
            this.data_multimedia = data_multimedia.multimedia;
            this.wsService.multimedia = this.data_multimedia;
            this.wsService.filtrarMultimedia();
          });

          this.obtener.getDataCoordenadas(this.id_reporte).subscribe((data_coordenadas: any ) => {
            // Reiniciar valores de las coordenadas
            this.wsService.longitudActual = 0.0;
            this.wsService.latitudActual = 0.0;
            this.wsService.tipo_ubicacion = '';
            this.fechaCoordenadas = "";
            this.direccionActual = {};
            this.direccionRegistrada = "";

            _direccion.distancia = 0.0;
            _direccion.metrosKilometros = "";

            //Traer nuevos valores
            if(data_coordenadas.id_coord_reporte){
              if(data_coordenadas.id_coord_reporte === this.id_reporte){
                this.wsService.latitudActual = data_coordenadas.lat_coord_reporte;
                this.wsService.longitudActual = data_coordenadas.lng_coord_reporte;
                this.wsService.tipo_ubicacion = data_coordenadas.tipo_ubicacion;
                this.fechaCoordenadas = data_coordenadas.fecha_coord_reporte;
    
                _direccion.distancia = _direccion.getDistanceBetweenTwoCoordinates(this.latitudComercio, this.longitudComercio, this.wsService.latitudActual, this.wsService.longitudActual);
                
                // Si se tienen coordenadas validas geocodigicarlas a dirección completa
                if(this.wsService.latitudActual != 0.0){
                  this._direccion.geocodificarDireccion((this.wsService.latitudActual).toString(),  (this.wsService.longitudActual).toString()).subscribe(( data: any) => {
                    if (data.status === 'OK') {
                      this.direccionActual.calle = data.results[0].address_components[1].long_name;
                      this.direccionActual.numero = data.results[0].address_components[0].long_name;
                      this.direccionActual.colonia = data.results[0].address_components[2].long_name;
                      this.direccionActual.cp = data.results[0].address_components[6].long_name;
                      this.direccionActual.localidad = data.results[0].address_components[3].long_name;
                      this.direccionActual.municipio = data.results[0].address_components[4].long_name;
                    }
                  });
                }
              }
            }
          });

          this._chat.getInfoChat(this.id_reporte).subscribe((resp: any)=>{
            console.log(resp);
            if(resp.ok){
              this.chat = resp.chat;
            } else {
              this.chat = undefined;
            }
          });

        }
      });     
    }); // TERMINA SUBSCRIBE A PARAMETROS 
  }

  ngOnInit() {
    
  }

  crearFormaAsignacion(){
    this.formaAsignacion = this.fb.group({
      reporte:  [0],
      unidad:   [0],
      usuario:  [0],
      titulo:   [''],
      mensaje:  ['']
    });
    this.cargarDataInicialFormaAsignacion();
  }

  cargarDataInicialFormaAsignacion(){
    this.formaAsignacion.reset({
      reporte:  0,
      unidad:   0, 
      usuario:  0,
      titulo:   'Nuevo reporte', 
      mensaje:  'Se te ha asignado un nuevo reporte'
    });
  }

  cargarDatosReporte (){
    // this.id_repor = this.data_reporte.id_reporte;
    this.id_user_cc = this.data_reporte.id_user_cc;
    this.id_com_reporte = this.data_reporte.id_com_reporte;
    this.id_user_app = this.data_reporte.id_user_app;
    this.id_user_cc = this.data_reporte.id_user_cc;
    this.wsService.estatusAlerta = this.data_reporte.estatus_actual;
  }

  guardarCampos( data ) {
    const dataReporte = {
      id_reporte: this.id_reporte, 
      estatus_actual: this.data_reporte.estatus_actual, 
      tipo_incid: data.control.value.incidente, 
      descrip_emerg: '', 
      cierre_conclusion: '', 
      num_unidad: data.control.value.unidad,
      idEstacion: this.auth.leerEstacion(),
      token: this.auth.leerToken()
    };

    if(data.control.value.unidad.length === 0){
      return Swal.fire({
        type: 'info', title: 'Ingrese folio CAD'
      });
    }
    // if(data.control.value.cierre.length === 0){
    //   Swal.fire({ 
    //     type: 'info', title: 'Atención', text: '¡Ingrese la conclusión correspondiente!'
    //   });
    // }   
    // if(data.control.value.notas.length === 0){
    //   dataReporte.descrip_emerg = '';
    // }
    if(data.control.value.incidente === 0 ){
      // Enviar por default 1 = Desconocido.
      dataReporte.tipo_incid = 1;
      // Swal.fire({ 
      //   type: 'info', title: 'Atención', text: '¡Seleccione tipo de incidente, por favor!'
      // });
    }

    if(data.valid && dataReporte.tipo_incid != 0) {
      this.alertasService.alertaCerrada(dataReporte)
    } else {
      Swal.fire({title:'Formulario no válido', type: 'info'});
    }
  }

  

  // COMIENZA LOGICA PARA SELECTED ANIDADOS
  // COMIENZA LOGICA PARA SELECTED ANIDADOS
  // COMIENZA LOGICA PARA SELECTED ANIDADOS

  getIncidentesBD(){
    this.incidentesService.getClasificacion().subscribe( ( misClasificaciones: any) => {
      if(misClasificaciones.ok){
        this.clasificacion = misClasificaciones.clasificacion;
      }
    });
    this.incidentesService.getSubclasificacion().subscribe( ( misSubclasificaciones: any) => {
      if(misSubclasificaciones.ok){
        this.subclasificacion = misSubclasificaciones.subclasificacion;
      } 
    });
    this.incidentesService.getIncidentes().subscribe( ( misIncidentes: any) => {
      if(misIncidentes.ok){
        this.incidentes = misIncidentes.incidentes;
      } 
    });
  }

  onSelectClasificacion(id_clasificacion: number) {
    this.selectedClasificacion = id_clasificacion;
    this.selectedSubclasificacion = 0;
    this.selectedIncidente = 0;
    this.filtro_incidentes = [];
    this.filtro_subclasificacion = this.subclasificacion.filter((subclasificacion) => {
      return subclasificacion.id_clasificacion_incid === Number(id_clasificacion);
    });
    // console.log('ID:', this.selectedClasificacion);
  }

  onSelectSubclasificacion(id_subclasificacion: number){
    this.selectedSubclasificacion = id_subclasificacion;
    this.selectedIncidente = 0;
    this.filtro_incidentes = this.incidentes.filter((incidente) => {
      return incidente.id_subclasificacion === Number(id_subclasificacion);
    });
    // console.log('Subclasificacion', this.selectedSubclasificacion);
  }

  onSelectIncidente(id_incidente: number){
    this.selectedIncidente = id_incidente;
    // console.log('El incidente es: ', this.selectedIncidente);
  }


  onSelectCorporacion(id_corporacion: number){
    this.formaAsignacion.get('unidad').setValue(0);
    this.formaAsignacion.get('usuario').setValue(0);
    // Limpiar filtros
    this.filtro_unidades = [];
    this.filtro_oficiales = [];
    // Buscar las unidades
    if(id_corporacion === 0) return;
    this.filtro_unidades = this.unidadesOnline.filter((unidad) =>{
      return unidad.id_corp === Number(id_corporacion);
    });
    // Eliminar repetidos
    let hash = {};
    this.filtro_unidades = this.filtro_unidades.filter(o => hash[o.num_unidad] ? false : hash[o.num_unidad] = true); 
  }


  onSelectUnidad(id_unidad: number){
    this.formaAsignacion.get('unidad').setValue(Number(id_unidad));
    this.formaAsignacion.get('usuario').setValue(0);
    // Limpiar filtros
    this.filtro_oficiales = [];
    // Buscar los oficiales
    if(id_unidad === 0) return;
    this.filtro_oficiales = this.unidadesOnline.filter((unidad) =>{
      return unidad.id_unidad === Number(id_unidad);
    });
    // Eliminar repetidos
    let hash = {};
    this.filtro_oficiales = this.filtro_oficiales.filter(o => hash[o.id_usuarios_cc] ? false : hash[o.id_usuarios_cc] = true); 
  }

  onSelectOficial(id_usuario: number){
    this.formaAsignacion.get('usuario').setValue(Number(id_usuario));
    // console.log(this.formaAsignacion.value);
  }
 

  enviarMensaje(data: any){
    if(data.valid){
      this.obtener.sendMessage(this.id_user_app, data.value.lblTitulo, data.value.txtDescripcion).subscribe((respuesta: any) => {
        if(respuesta.ok){
          Swal.fire({ type: 'success', title: 'Éxito', text: respuesta.message });
        } else {
          Swal.fire({ type: 'error', title: 'Error', text: respuesta.message });
        }
      })
    } else {
      Swal.fire({ type: 'info', title: 'Atención', text: '¡Complete todos los campos por favor!' });
    }
  }


  open(evt, multimediaName) {
    console.log('EVENTO: ', evt);
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    // Obtenga todos los elementos con class = "tablinks" y elimine la clase "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Muestre la pestaña actual y agregue una clase "activa" al enlace que abrió la pestaña
    document.getElementById(multimediaName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  // CHAT
  // CHAT
  // CHAT
  // CHAT

  enviar_mensaje_usuario(){

  }
  
  enviar_mensaje_unidad(){

  }

  // Mandar la información restab

  asignar_unidad(){
    console.log(this.data_reporte);
    console.log(this.chat);
    console.log('...................');
    if(Number(this.formaAsignacion.get('usuario').value) > 0){
      console.log('Asignar unidad...');
      var data: RequestAsignarUnidades = {
        reporte: this.id_reporte, 
        unidad: this.formaAsignacion.get('unidad').value, 
        usuario: this.formaAsignacion.get('usuario').value,
        titulo: this.formaAsignacion.get('titulo').value,
        mensaje: this.formaAsignacion.get('mensaje').value,
      }; 
      this._unidades.putAsignarUnidad(data).subscribe((respuesta: any)=>{
        // console.log('LA RESPUESTA DE LA ASIGNACION ES:');
        // console.log(respuesta);
        if(!respuesta.ok) {
          return Swal.fire({
            title: 'Error al asignar unidad',
            text: `${respuesta.mensaje}`,   
            type: 'error'
          });
        }
        if(respuesta.hasOwnProperty('resp')){
          this.data_reporte.id_unidad = this.formaAsignacion.get('unidad').value;
          this.data_reporte.id_unidad_usuario = this.formaAsignacion.get('usuario').value;
          // Chat
          this.chat.unidad_usuario_chat = 0;
          this.chat.id_unidad_chat = this.formaAsignacion.get('usuario').value;

          
          console.log(this.data_reporte);
          console.log(this.chat);
          console.log('...................');

          this.cargarDataInicialFormaAsignacion();
          this.filtro_unidades = [];
          this.filtro_oficiales = [];
          Swal.fire({
            text: 'Unidad asignada con éxito',
            type: 'success'
          });
        } else {
          console.log(respuesta.resp.resp.results[0].error.message);
          Swal.fire({
            title: 'Error al asignar unidad',
            text: `${respuesta.resp.resp.results[0].error.message}`,
            type: 'error'
          });
        }
      });
    } else {
      Swal.fire({
        text: 'Asigne correctamente una unidad',
        type: 'info'
      });
    }
  }

  getUnidadesOnline(estatus: number){
    this._unidades.getUnidadesOnline(estatus).subscribe( (resp: any) => {
      if(resp.ok){
        this.unidadesOnline = resp.res;
        // Eliminar repetidas
        let hash = {};
        this.filtro_corporaciones = this.unidadesOnline.filter(o => hash[o.id_corp] ? false : hash[o.id_corp] = true); 
      }
    });
  }

  habilitarDeshabilitarChat(estatus: number){
    this._chat.changePermisoChat('unus', estatus, this.id_reporte).subscribe((resp: any) =>{
      if(resp.ok){
        // Cambiar los botones
        this.chat.unidad_usuario_chat = resp.estatus;
      }
      
      Swal.fire({
        text: resp.mensaje,
        type: (resp.ok) ? 'success' : 'error'
      });
    });
  }
}
