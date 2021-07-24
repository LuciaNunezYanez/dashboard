import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { BusquedaService } from 'src/app/services/reporte/busqueda.service';
import { UsuariosNitService } from 'src/app/services/usuarios/usuarios-nit.service';
import { UtilidadesService } from '../../services/utilidades/utilidades.service';
import { DireccionService } from '../../services/direccion/direccion.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styles: []
})
export class ReportesComponent implements OnInit {

  // Formas
  formaBusqueda: FormGroup;
  
  // Combos
  operadoresCombo = [];
  municipiosCombo = [];
  localidadesCombo = [];

  // Patterns
  NUMERO_ENTERO_PATTERN ="^[0-9]+"

  // 
  REPORTE_BUSQUEDA: boolean = false;
  TABLA_BUSQUEDA: boolean = false;

  // Busqueda
  objResults: any = [];
  objUsuarios: any = [];
  objMunicipios: any = [];
  objLocalidades: any = [];

  // Reporte individual
  objReporteFull: any = [];
  objMultimedia: any = [];
  objActivaciones: any = [];
  objImagenes: any = [];
  objAudio: any = [];
  objVideo: any = [];
  objCoordenadas: any = {};

  // Variables para agmap
  ceroCoordenadas: boolean = false;
  tengoCoordenadas: number = 0;

  constructor(public fb: FormBuilder, public _util: UtilidadesService, private _busq: BusquedaService,
    private _login: LoginService, private _usuarios: UsuariosNitService, public _direccion: DireccionService,
    private _obtener: SharedService) { 
    this.crearFormaBusqueda();

    this.resetearFormaBusqueda(_util.getFecha(), _util.getFechaManana());

    // Cargar los usuarios del departamento, sala y estación correspondiente
    this._usuarios.getUsuarios().subscribe((results: any)=>{
      this.objUsuarios = results.usuarios;
    });


    // Cargar municipios
    this._direccion.getMunicipios(10).subscribe((results: any)=>{
      if(results.municipios){
        this.objMunicipios = results.municipios;
      }
    });
  }

  ngOnInit() {
  }

  crearFormaBusqueda(){
    this.formaBusqueda = this.fb.group({
      folio: ['',[Validators.maxLength(10), Validators.pattern(this.NUMERO_ENTERO_PATTERN)]],
      folioCAD: [''],
      id_operador: [0],
      operador:    ['', Validators.maxLength(99)],
      calle: ['', Validators.maxLength(99)],
      colonia: ['', Validators.maxLength(99)],
      id_municipio: [0],
      municipio: ['', Validators.maxLength(49)],
      fecha_inicio: [''],
      fecha_fin: [''],
      telefono: ['', [Validators.maxLength(10),Validators.pattern(this.NUMERO_ENTERO_PATTERN)]],
      numero: ['', [Validators.maxLength(9)]],
      cp: [[Validators.maxLength(5), Validators.pattern(this.NUMERO_ENTERO_PATTERN)]],
      id_localidad: [0],
      localidad: ['', Validators.maxLength(99)],
    });
  }

  resetearFormaBusqueda(fechaInicial: string, fechaFinal: string){
    this.formaBusqueda.reset({
      folio: '',
      folioCAD: '',
      id_operador: 0,
      operador: '',
      calle: '',
      colonia: '',
      id_municipio: 0,
      municipio: '',
      fecha_inicio: fechaInicial,
      fecha_fin: fechaFinal,
      telefono: '',
      numero: '',
      cp: '',
      id_localidad: 0,
      localidad: '',
    });
  }

  resetearObjetos(){
    this.objReporteFull = [];
    this.objMultimedia = [];
    this.objActivaciones = [];
    this.objImagenes = [];
    this.objAudio = [];
    this.objVideo = [];
    this.objCoordenadas = {};
  }

  buscarReportes(){
    this.resetearObjetos();

    let data: any = this.formaBusqueda.value;
    data.sala = this._login.leerSala();
    data.estacion = this._login.leerEstacion();

    this._busq.getBusquedaReportes(data).subscribe((results: any)=>{
      if(!results.ok){
        this.REPORTE_BUSQUEDA = false;
        this.TABLA_BUSQUEDA = false;

        // console.log('NOT WIN');
        // console.log(results);
        if(!results.results ){
          this.objResults = [];
          Swal.fire({ type: 'error', title: 'Ups', text: 'Error al realizar busqueda'});
          // console.log('VACIO');
        }

        if(results.mensaje){
          Swal.fire({ type: 'info', title: 'Atención', text: results.mensaje });
          // Mostrar mensaje en ventana emergente
        } // Si no, mostrar mensaje genérico
        
      } else {
        // WIN
        if(results.results.length == 0){
          this.REPORTE_BUSQUEDA = false;
          this.TABLA_BUSQUEDA = false;
          this.objResults = [];
          Swal.fire({ type: 'info', title: 'Atención', text: 'No hay resultados para su busqueda.' });
          // SIN DATOS
        } else {
          this.REPORTE_BUSQUEDA = false;
          this.TABLA_BUSQUEDA = true;
          this.objResults = results.results ; 
        }
      }
      
    })
    
  }


  openCity(evt, multimediaName) {
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

  obtenerUsuarios(){

  }

  verReporte(folio: number){
    this.TABLA_BUSQUEDA = false;
    this.REPORTE_BUSQUEDA = true;

    this._busq.getReporteFull(folio).subscribe((results: any)=>{
      console.log(results);
      if(results.reporteFull){
        this.objReporteFull = results.reporteFull;
        
        // Obtener el número de activaciones
        this._obtener.getDataActivaciones(folio).subscribe( (data_activaciones: any) => {
          if(data_activaciones.ok){
            this.objActivaciones = data_activaciones.activaciones;
          }  
        });

        // Traer los datos de la multimedia
        this._obtener.getDataMultimedia(folio).subscribe( (data_multimedia: any) => {
          this.objImagenes = this._util.filtrarMultimedia('imagen', data_multimedia);
          this.objAudio = this._util.filtrarMultimedia('audio', data_multimedia);
          this.objVideo = this._util.filtrarMultimedia('video', data_multimedia);
        });

        // Traer coordenadas
        this._obtener.getDataCoordenadas(folio).subscribe((data_coordenadas: any ) => {
          // Reiniciar valores de las coordenadas
          this.objCoordenadas.longitudActual = 0.0; //longitudActual  latitudActual tipo_ubicacion fechaCoordenadas direccionActual direccionRegistrada
          this.objCoordenadas.latitudActual = 0.0; 
          this.objCoordenadas.tipo_ubicacion = '';
          this.objCoordenadas.fechaCoordenadas = "";
          this.objCoordenadas.direccionActual = "";
          this.objCoordenadas.direccionRegistrada = "";

          this._direccion.distancia = 0.0;
          this._direccion.metrosKilometros = "";

          //Traer nuevos valores
          if(data_coordenadas.id_coord_reporte){
            if(data_coordenadas.id_coord_reporte === folio){
              console.log('SUPER IF');
              this.objCoordenadas.latitudActual = data_coordenadas.lat_coord_reporte;
              this.objCoordenadas.longitudActual = data_coordenadas.lng_coord_reporte;
              this.objCoordenadas.tipo_ubicacion = data_coordenadas.tipo_ubicacion;
              this.objCoordenadas.fechaCoordenadas = data_coordenadas.fecha_coord_reporte;
  
              this._direccion.distancia = this._direccion.getDistanceBetweenTwoCoordinates(this.objReporteFull.lat_dir, this.objReporteFull.lgn_dir, this.objCoordenadas.latitudActual, this.objCoordenadas.longitudActual);
            
              console.log(this.objReporteFull.lat_dir,this.objReporteFull.lgn_dir, this.objCoordenadas.latitudActual, this.objCoordenadas.longitudActual);
              // Si se tienen coordenadas validas geocodigicarlas a dirección completa
              if(this.objCoordenadas.latitudActual != 0.0){
                this._direccion.geocodificarDireccion((this.objCoordenadas.latitudActual).toString(),  (this.objCoordenadas.longitudActual).toString()).subscribe(( data: any) => {
                  if (data.status === 'OK') {
                    this.objCoordenadas.direccionActual = data.results[0].formatted_address;
                    console.log('ÑAM ÑAM');
                  }
                });
              } else {
                console.log('TE PASAS NICO');
              }
            } else  {
              console.log('ELSE MALO');
            }
          } else {
            console.log('SUPER ELSE');
          }
        });
      } else {
        // Avisar que ocurrió un error al traer reporte
        Swal.fire({ type: 'error', title: 'Ups', text: 'Ocurrió un error al traer los datos del reporte.'});
      }
    });
    // Mostrar reporte y ocultar tabla
  }

  onSelectMunicipio(id_municipio: number){
    // Vaciar el combo de localidades
    this.formaBusqueda.controls['localidad'].setValue('');
    this.formaBusqueda.controls['id_localidad'].setValue(0);

    if(id_municipio == 0 ){
      this.objLocalidades = [];
      this.formaBusqueda.controls['municipio'].setValue('');
    } else {
      // Dar valor a nombre del municipio
      this.objMunicipios.forEach(element => {
        if(Number.parseInt(element.ID_MUNICIPIOS) == id_municipio){
          this.formaBusqueda.controls['municipio'].setValue(element.NOMBRE_MUNICIPIO);
        }
      });

      this._direccion.getLocalidades(id_municipio).subscribe((results: any)=>{
        if(results.localidades){
          this.objLocalidades = results.localidades;
        }
      });
    }
  }

  onSelectLocalidad(id_localidad: number){
    if(id_localidad == 0 ){
      this.formaBusqueda.controls['localidad'].setValue('');
      this.formaBusqueda.controls['id_localidad'].setValue(0);
    } else {
      // Dar valor a nombre de la localidad
      this.objLocalidades.forEach(element => {
        if(Number.parseInt(element.ID_LOCALIDADES) == id_localidad){
          this.formaBusqueda.controls['localidad'].setValue(element.NOMBRE_LOCALIDAD);
        }
      });
    }
  }


  getEstatus(estatus: number){
    let res = 'Desconocido'
    switch (estatus) {
      case 0:
        res = 'Sin atender';
        break;
      case 1:
        res = 'En proceso';
        break;
      case 2:
        res = 'Atendida';
        break;
      case 3:
        res = 'Cancelada/ Sin atender';
        break;
      case 4:
        res = 'Cancelada/ Atendida';
        break;
    }
    return res;
  }

}
