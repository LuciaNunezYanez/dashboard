import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  distancia: number = 0.0;
  metrosKilometros: any = "";
  url = environment.wsUrl;

  constructor( private _http: HttpClient) { }

  getDistanceBetweenTwoCoordinates(lat1, lon1, lat2, lon2) {

    // console.log('Actual: ');
    // console.log('latitud', lat2);
    // console.log('longitud', lon2);
    // console.log('registrou');
    // console.log('latitud', lat1);
    // console.log('longitud', lon1);

    if(lat1 === 0.0 || lon1 === 0.0){
      return 0;
    }
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

    //console.log(d);
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

  geocodificarDireccion(latitud: String, longitud: String) {
    return this._http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${environment.API_KEY}`);
  }


  getEstados(){
    return this._http.get(`${this.url}/estados`)
  }

  getMunicipios(id_estado: number){
    return this._http.get(`${this.url}/municipios/${id_estado}`)
  }

  getLocalidades(id_municipio:  number){
    return this._http.get(`${this.url}/localidades/${id_municipio}`)
  }

}
