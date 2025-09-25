export namespace UserModels {

  export interface User {
    // --- Autenticación y Sistema ---
    id: string; // de la tabla 'users'
    email: string; // de la tabla 'users'
    role: 'user' | 'admin'; // Lógica del frontend
    status: 'active' | 'suspended' | 'banned'; // Lógica del frontend/admin
    created_at: string; // de la tabla 'users'

    // --- Información Personal Básica (de 'user_profiles') ---
    firstName: string;
    lastName: string;
    date_of_birth: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    
    // --- Perfil Social (de 'user_profiles') ---
    bio?: string;
    profile_picture_url?: string;
    cover_photo_url?: string; // <-- Campo nuevo
    interests?: string[]; // <-- Campo nuevo (representa el JSON de intereses)
    skills?: string[];    // <-- Campo nuevo (representa el JSON de habilidades)
    social_links?: {      // <-- Campo nuevo (representa el JSON de redes)
      linkedin?: string;
      github?: string;
      twitter?: string;
    };

    // --- Información Académica (de 'user_profiles') ---
    career: string;
    semester?: number;               // <-- Campo nuevo
    university_name?: string;        // <-- Campo nuevo
    is_verified_student?: boolean;   // <-- Campo nuevo

    // --- Configuraciones (de 'user_profiles') ---
    privacy_settings?: {             // <-- Campo nuevo
      show_email: 'all' | 'followers' | 'none';
      show_activity: 'all' | 'followers' | 'none';
    };
  }

}