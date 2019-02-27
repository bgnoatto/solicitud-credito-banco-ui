import { Pipe, PipeTransform } from '@angular/core';
import {Estado} from "../domain/estado";

@Pipe({
  name: 'descripcionEstado'
})
export class DescripcionEstadoPipe implements PipeTransform {

  transform(estado: Estado, args?: any): string {
    let resultado:string = 'CANCELADO';
    if(estado){
      let estadoAux:string = estado.toString().toUpperCase();
      switch(estadoAux) {
        case Estado.PENDIENTE.toString():
          return 'PENDIENTE';
        case Estado.CONSUMIDO.toString():
          return 'CONSUMIDO';
        case Estado.FACTURADO.toString():
          return 'FACTURADO';
        case Estado.CANCELADO.toString():
          return 'CANCELADO';
        case Estado.ENVIADO_RIESGO.toString():
          return 'ENVIADO A RIESGO';
        case Estado.RECIBIDO_RIESGO.toString():
          return 'RECIBIDO DE RIESGO';
        case Estado.ENVIADO_BANCO.toString():
          return 'ENVIADO AL BANCO';
        case Estado.RECHAZADO.toString():
          return 'RECHAZADO';
        case Estado.PARA_RECTIFICAR.toString():
          return 'PARA RECTIFICAR';
        case Estado.CONCILIADO.toString():
          return 'CONCILIADO';
        case Estado.REENVIADO.toString():
          return 'REENVIADO';
        case Estado.ANULADO.toString():
          return 'ANULADO';
        case Estado.INICIAL.toString():
          return 'INICIAL';
        case Estado.PAGADO.toString():
          return 'PAGADO';
        default:
          return 'CANCELADO';
    }
  }
  return resultado
  }
}

