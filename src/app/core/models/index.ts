export interface Denominacion {
  titulo?: string;
  creditos?: string;
  duracion?: string;
  costo?: string;
  mision?: string;
  vision?: string;
  objetivo?: string;
  snies?: string;
  resolucion?: string;
  acreditacion?: string;
  key?: string;
}

export interface Carrusel {
  titulo: string;
  urlImg: string;
  nameImg: string;
  urlInfo: string;
  fecha: string;
  info: string;
  estado: number;
  key?: string;
}

export interface Docente {
  foto: string;
  nombre: string;
  sintesis: string;
  fieldArray: any[];
  fieldArrayArticulos: any[];
  correo: string;
  fecha: string;
  cvlac: string;
  orcid: string;
  key?: string;
}

export interface Estudiante {
  foto: string;
  codigo: number;
  nombre: string;
  sintesis: string;
  fieldArray: any[];
  fieldArrayArticulos: any[];
  correo: string;
  fecha: string;
  cvlac: string;
  orcid: string;
  estado: number;
  key?: string;
}

export interface Egresado {
  foto: string;
  codigo: number;
  nombre: string;
  sintesis: string;
  fieldArray: any[];
  fieldArrayArticulos: any[];
  correo: string;
  fecha: string;
  cvlac: string;
  orcid: string;
  estado: number;
  key?: string;
}

export interface Articulo {
  anio: string;
  autores: string;
  enlace: string;
  nombreArticulo: string;
  resumen: string;
  revista: string;
  key?: string;
}

export interface Evento {
  titulo: string;
  img: string;
  nameImg: string;
  resenia: string;
  parrafo: any;
  fechaEvento: string;
  fechaPublicacion: string;
  url: string;
  key?: string;
}

export interface GrupoInvestigacion {
  codigoColciencias: string;
  nombreGrupo: string;
  liderGrupo: string;
  clasificacion: string;
  grupLAC: string;
  fieldArray?: any[];
  key?: string;
}

export interface Tesis {
  fieldArray: any[];
  key?: string;
}

export interface Libro {
  fieldArray: any[];
  key?: string;
}

export interface PlanEstudios {
  fieldArray: any[];
  key?: string;
}
