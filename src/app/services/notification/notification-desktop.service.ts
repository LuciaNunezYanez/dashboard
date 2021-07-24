import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationDesktopService {

  constructor() { }


  mostrarNotificacion(titulo, body, icon){
    console.log('Mostraré notificacion');
    const notification = new Notification(titulo, {
      body,
      icon
    } );

    notification.onclick = (e) => {
      window.location.href = environment.urlNotification
    }
  }
}
