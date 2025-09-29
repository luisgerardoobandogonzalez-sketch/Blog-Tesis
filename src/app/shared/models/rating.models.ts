export namespace RatingModels { 
export interface Rating {
  _id: string;
  rated_user_id: string;  // El usuario que es calificado
  rater_user_id: string;  // El usuario que emite la calificación
  rating_value: 1 | 2 | 3 | 4 | 5; // El valor de la calificación
  created_at: string;
}


}