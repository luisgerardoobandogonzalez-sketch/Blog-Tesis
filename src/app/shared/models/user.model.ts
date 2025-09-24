export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string; // Fecha de nacimiento (en formato ISO "YYYY-MM-DD")
  gender?: string;    // Género, opcional con el signo '?'
  profilePictureUrl?: string;
}
