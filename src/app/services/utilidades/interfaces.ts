// Columnas iguales a la base de datos
export interface Alerta {
    id_reporte: number,
    id_user_cc: number,
    id_com_reporte: number,
    id_user_app?: number,
    id_unidad_rep?: number,
    fecha_hora_docum?: string,
    fecha_hora_ataq?: string,
    tipo_incid?: number,
    descrip_emerg?: string,
    clasificacion_emerg?: number,
    estatus_actual?: number,
    cierre_conclusion?: string,
    id_unidad?: number,
    id_unidad_usuario?: number,
    id_corp?: number,
    num_unidad?: string,
    id_corporacion?: number,
    tipo_corp?: string, 
    botonazos?: number,
  
    tipo_incid_usuario?: string, 
    cuerpo_emerg_usuario?: string, 
    descrip_emerg_usuario?: string, 
    quien_emergencia?: string,
    abrev_grupo?: string
  }
  
  export interface Comercio { 
    id_comercio: number, 
    id_dir_comercio: number,
    num_empleados?: number,
    nombre_comercio?: string,
    giro?: string,
    telefono_fijo?: string,
    folio_comercio?: number,
    razon_social?: string,
    id_direccion?: number,
    calle?: string,
    numero?: string,
    colonia?: string,
    cp?: number,
    entre_calle_1?: string,
    entre_calle_2?: string,
    fachada?: string,
    id_localidad: number,
    lat_dir?: number,
    lgn_dir?: number,
    id_localidades: number,
    municipio_id?: number,
    clave_localidad?: string,
    nombre_localidad?: string,
    latitud?: number,
    longitud?: number,
    altitud?: string,
    carta?: string,
    ambito?: string,
    poblacion?: number,
    masculino?: number,
    femenino?: number,
    viviendas?: number,
    lat?: number,
    lng?: number,
    activo_localid?: number,
    id_municipios: number,
    estado_id?: number,
    clave_municipio?: string,
    nombre_municipio?: string,
    activo_mun?: number,
    id_estados: number,
    clave_estado?: string,
    nombre_estado?: string,
    abrev?: string,
    activo_ests?: number
  
  }
  
  export interface UsuarioComercio {
    id_usuarios_app: number ,
    id_com_user_app: number, 
    nombres_usuarios_app: string,
    apell_pat: string,
    apell_mat?: string,
    fecha_nacimiento?: string,
    sexo_app?:string,
    padecimientos?: string,
    tel_movil?: string,
    alergias?: string,
    tipo_sangre?: string,
    estatus_usuario?: number,
    id_comercio?: number,
    id_dir_comercio?: number,
    num_empleados?: number,
    nombre_comercio?: string,
    giro?: string,
    telefono_fijo?: string,
    folio_comercio?: number,
    razon_social?: string
    id_foto_perfil_app?: number
  
  }
  
  export interface Multimedia {
    id_multimedia: number,
    fechahora_captura: string,
    tipo_archivo: string,
    ruta: string,
    id_reporte_mult: number
  }
  
  
  export interface DatosMedicos {
    id_dato_medico: number, 
    habla: number,
    escucha: number,
    lee: number,
    escribe: number,
    habla_LSM: number,
    toma_medicamentos: string, 
    peso: string, 
    estatura: string, 
    senas_particulares: string,
    padecimientos_psicologicos: string  
  
  }
  
  export interface ContactoEmergencia {
    id_contacto_emergencia?: number, 
    id_usuario_app_emergencia?: number, 
    nombre_contacto_emerg: string,
    telefono_contacto_emerg: string, 
    parentezco_contacto_emerg: string
  }
  
  export interface Chat {
    id_chat: number,
    id_reporte_chat: number,
    operador_unidad_chat: number,
    operador_usuario_chat: number,
    unidad_usuario_chat: number,
    id_operador_cc_chat: number,
    id_unidad_chat: number,
    id_usuario_chat: number
}

