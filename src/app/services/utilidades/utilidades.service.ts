import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private auth: LoginService) { }

  getFecha(){
    const date = new Date();
    var fecha: any = date.getFullYear();
    if((date.getMonth()+1) < 9){
      fecha = fecha +'-0'+ (date.getMonth()+1);
    } else {
      fecha = fecha +'-'+(date.getMonth()+1);
    }

    if(date.getDate() < 9){
      fecha = fecha +'-0'+ date.getDate();
    } else {
      fecha = fecha +'-'+date.getDate();
    }
    return fecha;
  }
  
  getFechaManana(){
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    var fecha: any = tomorrow.getFullYear();
    if((tomorrow.getMonth()+1) < 9){
      fecha = fecha +'-0'+ (tomorrow.getMonth()+1);
    } else {
      fecha = fecha +'-'+(tomorrow.getMonth()+1);
    }

    if(tomorrow.getDate() < 9){
      fecha = fecha +'-0'+ tomorrow.getDate();
    } else {
      fecha = fecha +'-'+tomorrow.getDate();
    }
    return fecha;
  }

  filtrarMultimedia(filtro: string, object: any){
    return object.multimedia.filter(dato => dato.tipo_archivo === filtro);
  }

  generarRuta( ruta ) {
    // Enviar el codigo del usuario que tiene el reporte
    const RUTA = `${environment.wsUrl}/${ruta}?token=${this.auth.leerToken()}`;
    // console.log('-------------RUTA-------------');
    console.log(RUTA);
    return RUTA;
  }


  getNumToValor(numero: number){
    switch (numero) {
      case 0:
        return 'No';
      case 1:
        return 'Si';
      case 2:
        return '';
    }
  }
}
