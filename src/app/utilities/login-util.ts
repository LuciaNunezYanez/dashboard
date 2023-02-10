

const mostrarOpcionesMenu = function Object(tipo_permiso: string){
    if(tipo_permiso === 'p_normal_admin'){         // Admin
        return {
            alertas:    true, 
            registrar:  false, //Registrar pero de TR
            buscar:     true,
            reportetr:  false, 
            reporte: {
                informacion: true, 
                hora: true, 
                reporteManual: true,
                cerrarReporte: true,

                mapa: true,
                imagenes: true,
                audio: true,
                video: true,
                chat: false
            },
            valido:    true
        };
    } else if (tipo_permiso === 'p_normal'){ // Normal
        return {
            alertas:    true, 
            registrar:  false, 
            buscar:     true,
            reportetr:  false,
            reporte: {
                informacion: true, 
                hora: true, 
                reporteManual: true,
                cerrarReporte: true,
                
                mapa: true,
                imagenes: true,
                audio: true,
                video: true,
                chat: false
            }, 
            valido: true
        }
    } if(tipo_permiso === 'p_tr_admin'){         // Admin
        return {
            alertas:    true, 
            registrar:  true,
            buscar:     true,
            reportetr: true, 
            reporte: {
                informacion: true, 
                hora: true, 
                reporteManual: false,
                cerrarReporte: false,

                mapa: true,
                imagenes: false,
                audio: false,
                video: false,
                chat: true
            },
            valido:    true
        };
    } else if (tipo_permiso === 'p_tr'){ // Normal
        return {
            alertas:    true, 
            registrar:  false, 
            buscar:     true,
            reportetr:  true,
            reporte: {
                informacion: true, 
                hora: true, 
                reporteManual: false,
                cerrarReporte: false,
                
                mapa: true,
                imagenes: false,
                audio: false,
                video: false,
                chat: true
            }, 
            valido: true
        }
    }  else {                      // Usuario inválido
        return {
            alertas:    false, 
            registrar:  false, 
            buscar:     false,
            reportetr:  false,
            reporte: {
                informacion: false, 
                hora: false, 
                reporteManual: false,
                cerrarReporte: false,
                
                mapa: false,
                imagenes: false,
                audio: false,
                video: false,
                chat: false
            }, 
            valido: false
        }
    } 
}

export {
     mostrarOpcionesMenu
}