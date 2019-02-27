import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeString'
})
export class CapitalizeStringPipe implements PipeTransform {

  transform(valor: string, args?: any): string {
    if (valor) {
      return valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
    }
    return valor;
  }

}
