import { Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class StarRatingComponent implements OnChanges {
  @Input() rating: number = 0;
  ratingPercent: number = 0;

    
  @Input() isInteractive: boolean = false; // <-- Nuevo: para decidir si se puede votar
  @Output() ratingChange = new EventEmitter<number>(); // <-- Nuevo: para emitir el voto

  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  ngOnChanges() {
    // Convierte una calificación de 1-5 a un porcentaje de 0-100
    this.ratingPercent = (this.rating / 5) * 100;
  }

   onStarHover(star: number) {
    if (this.isInteractive) {
      this.hoverRating = star;
    }
  }

  onMouseLeave() {
    if (this.isInteractive) {
      this.hoverRating = 0;
    }
  }

  onStarClick(star: number) {
    if (this.isInteractive) {
      this.rating = star; // Actualiza el valor visualmente
      this.ratingChange.emit(star); // Emite el nuevo valor hacia el componente padre
    }
  }
}