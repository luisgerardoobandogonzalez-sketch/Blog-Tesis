import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderTranslate',
  standalone: true, // Importante para que sea standalone
})
export class GenderTranslatePipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) {
      return '';
    }

    switch (value.toLowerCase()) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Femenino';
      case 'other':
        return 'Otro';
      default:
        return value; // Si no coincide, devuelve el valor original
    }
  }
}