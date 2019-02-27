import {Estado} from "./estado";
export interface Solicitud{
  id:number,
  codigoOperacion:string,
  dniCliente:string,
  sexoCliente:string,
  nombreCliente:string,
  monto:number,
  fecha:Date,
  codigoLocal:string,
  legajoCajero:number,
  observaciones:string,
  estado:Estado,
  estadoAnt:Estado,
  cuotas:number
}
