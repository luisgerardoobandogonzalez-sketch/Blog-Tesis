/**
 * Modelo de Favoritos/Guardados
 */
export namespace FavoritesModels {

    /**
     * Representa un blog guardado por el usuario
     */
    export interface Favorite {
        _id: string;
        user_id: string;
        blog_id: string;
        created_at: string;
        folder?: string; // Opcional: para organizar en carpetas
    }

    /**
     * Carpeta para organizar favoritos
     */
    export interface FavoriteFolder {
        _id: string;
        user_id: string;
        name: string;
        icon?: string;
        created_at: string;
    }

    /**
     * Estadísticas de favoritos
     */
    export interface FavoriteStats {
        total_favorites: number;
        folders_count: number;
        most_saved_category?: string;
    }
}
