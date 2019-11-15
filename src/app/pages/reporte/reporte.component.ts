import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Alerta, Comercio, UsuarioComercio, Multimedia } from '../../services/sockets/websocket.service';
import { mostrarAlertaError } from '../../utilities/utilities';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styles: []
})
export class ReporteComponent implements OnInit {

  private id_reporte:number = 0;
  private data_reporte: Alerta;
  private data_comercio: Comercio;
  private data_usuario_comercio: UsuarioComercio;
  private data_multimedia: Multimedia[];

  public imagenes: any[] = [];
  public audios: any[] = [];

  // Información general del reporte 
  private id_user_cc: number = 0; 
  private id_com_reporte: number = 0; 
  private id_user_app: number = 0; 
  public id_repor: number;
  public id_unidad_rep: number = 0; 
  public fecha_hora_docum: string = ''; 
  public fecha_hora_ataq: string = ''; 
  public tipo_incid: number = 0; 
  public descrip_emerg: string = ''; 
  public clasificacion_emerg: number = 0; 
  public estatus_actual: number = 0; 
  public cierre_conclusion: string = ''; 
  public id_unidad: number = 0; 
  public id_corp: number = 0; 
  public num_unidad: string = ''; 
  public id_corporacion: number = 0; 
  public tipo_corp: string = '';

  // Información del comercio 
  private id_comercio: number = 0; 
  private id_dir_comercio: number = 0;
  public num_empleados?: number = 0;
  public nombre_comercio: string = '';
  public telefono_fijo?: string = '';
  private id_direccion?: number = 0;
  public calle?: string = '';
  public numero?: string = '';
  public colonia?: string = '';
  public cp?: number = 0;
  public entre_calle_1?: string = '';
  public entre_calle_2?: string = '';
  public fachada?: string = '';
  private id_localidad: number = 0;
  private id_localidades: number = 0;
  public municipio_id?: number = 0;
  public nombre_localidad?: string = '';
  public latitud?: number = 0;
  public longitud?: number = 0;
  public altitud?: string = '';
  private id_municipios: number = 0;
  public estado_id?: number = 0;
  public clave_municipio?: string = '';
  public nombre_municipio?: string = '';
  public activo_mun?: number = 0;
  private id_estados: number = 0;
  public nombre_estado?: string = '';

  // Información del usuario comercio
  private id_usuarios_app = 0;
  private id_com_user_app = 0;
  public nombres_usuarios_app = '';
  public apell_pat = '';
  public apell_mat = '';
  public tel_movil = '';
  
  constructor(private routerActive: ActivatedRoute, private obtener: SharedService) {
    
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
          this.cargarDatosReporte(); 
          // Traer los datos del comercio (2)
          if(this.id_com_reporte === 0){
            mostrarAlertaError('Folio de comercio incorrecto', 'Verifique sus datos');
          } else {
            this.obtener.getDataComercio(this.id_com_reporte).subscribe( (data_comercio: any) => {
            this.data_comercio = data_comercio.comercio[0];
            this.cargarDatosComercio();
            });
          }

          // Traer los datos del usuario comercio (3)
          if(this.id_user_app === 0){
            mostrarAlertaError('Folio de usuario comercio incorrecto', 'Verifique sus datos');
          } else {
            this.obtener.getDataUsuarioComercio(this.id_user_app).subscribe( (data_usuario_comercio  : any) => {
            this.data_usuario_comercio = data_usuario_comercio.resp;
            // console.log('Los datos del comercio son:', this.data_usuario_comercio);
            this.cargarDatosUsuario();
            });
          }

          // Traer los datos de la multimedia (4)
          this.obtener.getDataMultimedia(this.id_reporte).subscribe( (data_multimedia: any) => {
            this.data_multimedia = data_multimedia.multimedia;
            this.imagenes = this.data_multimedia.filter( dato => dato.tipo_archivo === 'imagen');
            this.audios = this.data_multimedia.filter( dato => dato.tipo_archivo === 'audio');
            console.log('Mi data multimedia es:', this.data_multimedia);
            console.log('Mis imagenes son:', this.imagenes);
            console.log('Mis audios son:', this.audios);
          });
        }
      });

      
    }); // T subsribe 
  }

  ngOnInit() {
  }

  cargarDatosReporte (){
    this.id_repor = this.data_reporte.id_reporte;
    this.id_user_cc = this.data_reporte.id_user_cc;
    this.id_com_reporte = this.data_reporte.id_com_reporte;
    this.id_user_app = this.data_reporte.id_user_app;
    this.id_unidad_rep = this.data_reporte.id_unidad_rep;
    this.fecha_hora_docum = this.data_reporte.fecha_hora_docum;
    this.fecha_hora_ataq = this.data_reporte.fecha_hora_ataq;
    this.tipo_incid = this.data_reporte.tipo_incid;
    this.descrip_emerg = this.data_reporte.descrip_emerg;
    this.clasificacion_emerg = this.data_reporte.clasificacion_emerg;
    this.estatus_actual = this.data_reporte.estatus_actual;
    this.cierre_conclusion = this.data_reporte.cierre_conclusion;
    this.id_unidad = this.data_reporte.id_unidad;
    this.id_corp = this.data_reporte.id_corp;
    this.num_unidad = this.data_reporte.num_unidad;
    this.id_corporacion = this.data_reporte.id_corporacion;
    this.tipo_corp = this.data_reporte.tipo_corp;
    this.id_user_cc = this.data_reporte.id_user_cc;
  }

  cargarDatosComercio(){
    // this.id_comercio = this.data_comercio.; 
    this.id_dir_comercio = this.data_comercio.id_dir_comercio;
    // this.num_empleados = this.data_comercio.;
    this.nombre_comercio = this.data_comercio.nombre_comercio;
    this.telefono_fijo = this.data_comercio.telefono_fijo;
    this.id_direccion = this.data_comercio.id_direccion;
    this.calle = this.data_comercio.calle;
    this.numero = this.data_comercio.numero;
    this.colonia = this.data_comercio.colonia;
    this.cp = this.data_comercio.cp;
    this.entre_calle_1 = this.data_comercio.entre_calle_1;
    this.entre_calle_2 = this.data_comercio.entre_calle_2;
    this.fachada = this.data_comercio.fachada;
    // this.id_localidad = this.data_comercio.id_localida;
    // this.id_localidades = this.data_comercio.id_localidades;
    // this.municipio_id = this.data_comercio.municipio_id;
    // this.nombre_localidad = this.data_comercio.nombre_localidad;
    // this.latitud = this.data_comercio.latitud;
    // this.longitud = this.data_comercio.longitud;
    // this.altitud = this.data_comercio.altitud;
    // this.id_municipios = this.data_comercio.id_municipios;
    // this.estado_id = this.data_comercio.estado_id;
    // this.clave_municipio = this.data_comercio.clave_municipio;
    this.nombre_municipio = this.data_comercio.nombre_municipio;
    // this.activo_mun = this.data_comercio.activo_mun;
    // this.id_estados = this.data_comercio.id_estados;
    this.nombre_estado = this.data_comercio.nombre_estado;
  }

  cargarDatosUsuario() {
    this.id_usuarios_app = this.data_usuario_comercio.id_usuarios_app;
    this.id_com_user_app = this.data_usuario_comercio.id_com_user_app; 
    this.nombres_usuarios_app = this.data_usuario_comercio.nombres_usuarios_app;
    this.apell_pat = this.data_usuario_comercio.apell_pat;
    this.apell_mat = this.data_usuario_comercio.apell_mat;
    this.tel_movil = this.data_usuario_comercio.tel_movil;
    
  }
  
  guardarCampos( data ) {
    console.log( data );
  }

  generarRuta( ruta ) {
    return `${environment.wsUrl}/${ruta}`;
  }
}
