import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalizacionService {

  distancia: number = 0.0;
  metrosKilometros: any = "";

  constructor() { }

  getDistanceBetweenTwoCoordinates(lat1, lon1, lat2, lon2) {

    // console.log('Está: ');
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
