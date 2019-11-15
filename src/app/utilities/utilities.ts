import Swal from 'sweetalert2';

export function mostrarAlertaError( titulo: string, mensaje: string){
    return Swal.fire({
      type: 'error',
      title: titulo,
      text: mensaje
    });
  }