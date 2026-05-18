export interface Denominacion {
  // Pestaña: Programa
  nombrePrograma?: string;
  tituloOtorgar?: string;
  registroCalificado?: string;
  urlRegistroCalificado?: string;
  renovacionRegistro?: string;
  urlRenovacionRegistro?: string;
  modalidad?: string;
  periodicidadAdmision?: string;
  numeroCreditos?: string;
  duracion?: string;
  costoMatricula?: string;
  urlCostoMatricula?: string;
  cupoPorCorte?: string;
  snies?: string;
  urlSnies?: string;
  // Pestaña: Misión y Visión
  mision?: string;
  vision?: string;
  // Pestaña: Propósito
  proposito?: string;
  necesidadesPais?: string;    // separadas por salto de línea
  areasAcademicas?: string;    // separadas por salto de línea
  // Campos heredados (compatibilidad con home)
  titulo?: string;
  creditos?: string;
  costo?: string;
  objetivo?: string;
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
  fieldArray: any[];           // logros académicos
  fieldArrayArticulos: any[]; // artículos
  correo: string;
  fecha: string;
  cvlac: string;
  orcid: string;
  cargo?: string;             // Ej: Profesor Titular
  dedicacion?: string;        // Ej: Tiempo Completo
  grupoInvestigacion?: string;
  lineasInvestigacion?: string; // separadas por salto de línea
  transparencia?: string;     // URL ley de transparencia
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
