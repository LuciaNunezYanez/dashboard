import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Alerta, Comercio, UsuarioComercio, Multimedia, WebsocketService } from '../../services/sockets/websocket.service';
import { mostrarAlertaError } from '../../utilities/utilities';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../services/login.service';
import { IncidentesService } from '../..//services/reporte/incidentes.service';
import { ThrowStmt } from '@angular/compiler';
import { AlertasNitService } from '../../services/sockets/alertas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  idUsuarioNIT = 4; // Cambiar ID por el del usuario que se logeo


  private id_reporte:number = 0;
  public data_reporte: Alerta;
  public data_comercio: Comercio;
  public data_usuario_comercio: UsuarioComercio;
  private data_multimedia: Multimedia[];

  public imagenes: any[] = [];
  public audios: any[] = [];

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

  latitudActual: number = 0.0;
  longitudActual: number = 0.0;
  fechaCoordenadas: String = "";
  distancia: number = 0.0;
  metrosKilometros: any = "";

  constructor(private routerActive: ActivatedRoute, 
    private obtener: SharedService, 
    private auth: LoginService,
    public wsService: WebsocketService, 
    private incidentesService: IncidentesService, 
    private alertasService: AlertasNitService, 
    private route: Router) {
        
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
          // Cancelar la suscripción anterior
          this.wsService.removeListenerNuevaImagen(this.ultima_suscripcion);
          this.wsService.removeListenerNuevoAudio(this.ultima_suscripcion);    
          this.wsService.removeListenerGeolocalizacion(this.ultima_suscripcion);      

          // Suscribirse a los cambios de una imagen y audio
          this.ultima_suscripcion = this.id_reporte;
          this.wsService.escucharNuevaImagen(this.id_reporte);
          this.wsService.escucharNuevoAudio(this.id_reporte);
          this.wsService.escucharNuevaGeolocalizacion(this.id_reporte);

          this.cargarDatosReporte(); 
          // Traer los datos del comercio (2)
          if(this.id_com_reporte === 0){
            mostrarAlertaError('Folio de comercio incorrecto', 'Verifique sus datos');
          } else {
            this.obtener.getDataComercio(this.id_com_reporte).subscribe( (data_comercio: any) => {
              this.data_comercio = data_comercio.comercio[0];
              this.latitudComercio = this.data_comercio.lat_dir;
              this.longitudComercio = this.data_comercio.lgn_dir;
              // console.log("LATITUD COM: " + this.latitudComercio + " LONGITUD COM: " + this.longitudComercio);
              // console.log(this.data_comercio);
            });
          }

          // Traer los datos del usuario comercio (3)
          if(this.id_user_app === 0){
            mostrarAlertaError('Folio de usuario comercio incorrecto', 'Verifique sus datos');
          } else {
            this.obtener.getDataUsuarioComercio(this.id_user_app).subscribe( (data_usuario_comercio  : any) => {
              this.data_usuario_comercio = data_usuario_comercio.resp;
              // console.log('Los datos del comercio son:', this.data_usuario_comercio);
            });
          }

          // Traer los datos de la multimedia (4)
          this.obtener.getDataMultimedia(this.id_reporte).subscribe( (data_multimedia: any) => {
            this.data_multimedia = data_multimedia.multimedia;
            this.wsService.multimedia = this.data_multimedia;
            this.wsService.filtrarMultimedia();
          });

          this.obtener.getDataCoordenadas(this.id_reporte).subscribe((data_coordenadas: any ) => {
            // Reiniciar valores de las coordenadas
            this.longitudActual = 0.0;
            this.latitudActual = 0.0;
            this.fechaCoordenadas = "";
            this.distancia = 0.0;
            this.metrosKilometros = "";

            //Traer nuevos valores
            if(data_coordenadas.id_coord_reporte){
              if(data_coordenadas.id_coord_reporte === this.id_reporte){
                this.latitudActual = data_coordenadas.lat_coord_reporte;
                this.longitudActual = data_coordenadas.lng_coord_reporte;
                this.fechaCoordenadas = data_coordenadas.fecha_coord_reporte;
                // console.log('LATITUD ACTUAL: ', this.latitudActual);
                // console.log('LONGITUD ACTUAL: ', this.longitudActual);
                // console.log('FECHA COORDENADAS: ', this.fechaCoordenadas);

                this.distancia = this.getDistanceBetweenTwoCoordinates(this.latitudComercio, this.longitudComercio, this.latitudActual, this.longitudActual);
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
  }

  guardarCampos( data ) {
    const info = {
      id_reporte: this.id_reporte, 
      id_user_cc: this.idUsuarioNIT, 
      estatus_actual: 1, 
      tipo_incid: data.control.value.incidente, 
      descrip_emerg: data.control.value.notas, 
      cierre_conclusion: data.control.value.cierre, 
      num_unidad: data.control.value.unidad
    };

    if(data.control.value.unidad.length === 0){
      Swal.fire({
        type: 'error', title: 'Error', text: 'Ingrese número de la unidad que atendió la petición'
      });
    }
    if(data.control.value.cierre.length === 0){
      Swal.fire({ 
        type: 'error', title: 'Error', text: 'Ingrese la conclusión correspondiente'
      });
    }   
    if(data.control.value.notas.length === 0){
      Swal.fire({ 
        type: 'error', title: 'Error', text: 'Ingrese descripción de la emergencia' 
      });
    }
    if(data.control.value.incidente === 0 ){
      Swal.fire({ 
        type: 'error', title: 'Error', text: 'Seleccione incidente'
      });
    }

    if(data.valid && data.control.value.incidente != 0) {
      this.alertasService.alertaCerrada(info)
    }
    
    // console.log( info );
    // console.log(data);
  }

  generarRuta( ruta ) {
    // Enviar el codigo del usuario que tiene el reporte
    const RUTA = `${environment.wsUrl}/${ruta}?token=${this.auth.leerToken()}&id_usuario_pertenece=20`;
    return RUTA;
    
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
    console.log('El incidente es: ', this.selectedIncidente);
  }
 
  // TERMINA LOGICA PARA SELECTED ANIDADOS

  // CALCULA LA DISTANCIA ENTRE DOS COORDENADAS 
  getDistanceBetweenTwoCoordinates(lat1, lon1, lat2, lon2) {

    // console.log('Està: ');
    // console.log('latitud', this.latitudActual);
    // console.log('longitud', this.longitudActual);
    // console.log('registro');
    // console.log('latitud', this.latitudComercio);
    // console.log('longitud', this.longitudComercio);

    var R = 6371; // Radio de la tierra en km
    var dLat = this.deg2rad(lat2-lat1); 
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distancia en km

    // console.log(d);
    if(d >= 1.0){
      this.metrosKilometros = "Kilometros";
    } else {
      this.metrosKilometros = "Metros";
      d = d * 1000;
    }
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
}
