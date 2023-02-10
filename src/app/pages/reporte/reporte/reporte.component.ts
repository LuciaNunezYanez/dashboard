import { Component, OnInit } from '@angular/core';
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
import { WebsocketService } from '../../../services/sockets/websocket.service';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  private id_reporte:number = 0;
  private id_direccion_usuario: number = 0;
  public data_reporte: Alerta;
  public data_comercio: Comercio;
  public data_usuario_comercio: UsuarioComercio;
  public data_medico: DatosMedicos;
  private data_multimedia: Multimedia[];
  public contactos_emergencia: [ContactoEmergencia];

  public imagenes: any[] = [];
  public audios: any[] = [];
  public data_img_perfil;

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

  constructor(private routerActive: ActivatedRoute,
    private obtener: SharedService, 
    private auth: LoginService,
    public wsService: WebsocketService, 
    private incidentesService: IncidentesService, 
    private alertasService: AlertasNitService, 
    public _direccion: DireccionService,
    private route: Router, 
    public _utl: UtilidadesService) {

    // Mostrar las opciones correspondientes al usuario
    this.opcionesHabilitadas = mostrarOpcionesMenu(auth.leerTipoPermiso());

    // OBTENER LA LISTA DE INCIDENTES DE LA BD 
    this.getIncidentesBD();
        
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
                    // console.log(this.data_medico);
                  } else {
                    datos_medicos = undefined;
                  }
                })
              }

              if(this.data_usuario_comercio.id_foto_perfil_app > 0){
                this.obtener.getRutaImgPerfil(this.data_usuario_comercio.id_foto_perfil_app).subscribe((data_imagen: any)=>{
                  if(data_imagen.imagen){
                    this.data_img_perfil = data_imagen.imagen;
                  } else {
                    this.data_img_perfil = undefined;
                  }
                });
              } else {
                this.data_img_perfil = undefined;
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
                      this.direccionActual.calle = (data.results[0].address_components[1])? data.results[0].address_components[1].long_name: '';
                      this.direccionActual.numero = (data.results[0].address_components[0])?data.results[0].address_components[0].long_name: '';
                      this.direccionActual.colonia = (data.results[0].address_components[2])?data.results[0].address_components[2].long_name: '';
                      this.direccionActual.cp = (data.results[0].address_components[6])?data.results[0].address_components[6].long_name: '';
                      this.direccionActual.localidad = (data.results[0].address_components[3])?data.results[0].address_components[3].long_name: '';
                      this.direccionActual.municipio = (data.results[0].address_components[4])?data.results[0].address_components[4].long_name: '';
                    }
                  });
                }
              }
            }
          });

        }
      });     
    }); // TERMINA SUBSCRIBE A PARAMETROS 
  }

  ngOnInit() {
    
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

  abrirImgGrande(ruta_imagen){
    console.log(ruta_imagen);
  }


  openCity(evt, multimediaName) {
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

  copyText(text: string){
    navigator.clipboard.writeText(text);
  }

}
