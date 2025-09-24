export namespace UserModels{

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  date_of_birth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  career: string;
  bio?: string;
  profile_picture_url?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'banned'; // <-- Campo nuevo
  created_at: string; // <-- Campo nuevo
}

}
