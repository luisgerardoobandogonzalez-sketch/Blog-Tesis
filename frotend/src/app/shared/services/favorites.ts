import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Models } from '../models/models';
import { AuthService } from 'src/app/core/services/auth';
import { BlogService } from './blog';

const FAVORITES_STORAGE_KEY = 'user_favorites';
const FOLDERS_STORAGE_KEY = 'favorite_folders';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {

    private favoritesChanged = new BehaviorSubject<void>(undefined);
    public favoritesChanged$ = this.favoritesChanged.asObservable();

    private fakeFavorites: Models.Favorites.Favorite[] = [];
    private fakeFolders: Models.Favorites.FavoriteFolder[] = [
        {
            _id: 'default',
            user_id: '',
            name: 'Sin carpeta',
            icon: 'folder-outline',
            created_at: new Date().toISOString()
        }
    ];

    constructor(
        private authService: AuthService,
        private blogService: BlogService
    ) {
        this.loadFromStorage();
    }

    /**
     * Carga favoritos y carpetas desde localStorage
     */
    private loadFromStorage(): void {
        const favoritesData = localStorage.getItem(FAVORITES_STORAGE_KEY);
        const foldersData = localStorage.getItem(FOLDERS_STORAGE_KEY);

        if (favoritesData) {
            this.fakeFavorites = JSON.parse(favoritesData);
        }

        if (foldersData) {
            const loadedFolders = JSON.parse(foldersData);
            // Asegurar que siempre existe la carpeta "default"
            if (!loadedFolders.find((f: Models.Favorites.FavoriteFolder) => f._id === 'default')) {
                this.fakeFolders = [...this.fakeFolders, ...loadedFolders];
            } else {
                this.fakeFolders = loadedFolders;
            }
        }
    }

    /**
     * Guarda favoritos en localStorage
     */
    private saveToStorage(): void {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(this.fakeFavorites));
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(this.fakeFolders));
        this.favoritesChanged.next();
    }

    /**
     * Guarda un blog en favoritos
     */
    saveBlog(blogId: string, folderId: string = 'default'): Observable<boolean> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) {
            console.error('Usuario no autenticado');
            return of(false);
        }

        // Verificar si ya está guardado
        const exists = this.fakeFavorites.some(
            f => f.user_id === currentUser.id && f.blog_id === blogId
        );

        if (exists) {
            console.log('Blog ya está en favoritos');
            return of(false);
        }

        const newFavorite: Models.Favorites.Favorite = {
            _id: `fav_${Date.now()}`,
            user_id: currentUser.id,
            blog_id: blogId,
            folder: folderId,
            created_at: new Date().toISOString()
        };

        this.fakeFavorites.push(newFavorite);
        this.saveToStorage();
        console.log('Blog guardado en favoritos:', newFavorite);

        return of(true).pipe(delay(100));
    }

    /**
     * Quita un blog de favoritos
     */
    unsaveBlog(blogId: string): Observable<boolean> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) return of(false);

        const initialLength = this.fakeFavorites.length;
        this.fakeFavorites = this.fakeFavorites.filter(
            f => !(f.user_id === currentUser.id && f.blog_id === blogId)
        );

        if (this.fakeFavorites.length < initialLength) {
            this.saveToStorage();
            console.log('Blog eliminado de favoritos');
            return of(true).pipe(delay(100));
        }

        return of(false);
    }

    /**
     * Verifica si un blog está guardado
     */
    isSaved(blogId: string): Observable<boolean> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) return of(false);

        const isSaved = this.fakeFavorites.some(
            f => f.user_id === currentUser.id && f.blog_id === blogId
        );

        return of(isSaved);
    }

    /**
     * Obtiene todos los blogs favoritos del usuario actual
     */
    getFavorites(folderId?: string): Observable<Models.Blog.Blog[]> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) return of([]);

        let userFavorites = this.fakeFavorites.filter(f => f.user_id === currentUser.id);

        // Filtrar por carpeta si se especifica
        if (folderId && folderId !== 'all') {
            userFavorites = userFavorites.filter(f => f.folder === folderId);
        }

        const blogIds = userFavorites.map(f => f.blog_id);

        // Obtener los blogs completos usando el BlogService
        return this.blogService.getAllBlogsForAdmin().pipe(
            map(allBlogs => allBlogs.filter(blog => blogIds.includes(blog._id)))
        );
    }

    /**
     * Crea una nueva carpeta de favoritos
     */
    createFolder(name: string, icon: string = 'folder-outline'): Observable<Models.Favorites.FavoriteFolder> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }

        const newFolder: Models.Favorites.FavoriteFolder = {
            _id: `folder_${Date.now()}`,
            user_id: currentUser.id,
            name: name,
            icon: icon,
            created_at: new Date().toISOString()
        };

        this.fakeFolders.push(newFolder);
        this.saveToStorage();

        return of(newFolder).pipe(delay(100));
    }

    /**
     * Obtiene todas las carpetas del usuario
     */
    getFolders(): Observable<Models.Favorites.FavoriteFolder[]> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) return of([]);

        const userFolders = this.fakeFolders.filter(
            f => f._id === 'default' || f.user_id === currentUser.id
        );

        return of(userFolders);
    }

    /**
     * Mueve un favorito a otra carpeta
     */
    moveToFolder(blogId: string, newFolderId: string): Observable<boolean> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) return of(false);

        const favorite = this.fakeFavorites.find(
            f => f.user_id === currentUser.id && f.blog_id === blogId
        );

        if (favorite) {
            favorite.folder = newFolderId;
            this.saveToStorage();
            return of(true).pipe(delay(100));
        }

        return of(false);
    }

    /**
     * Obtiene estadísticas de favoritos del usuario
     */
    getFavoriteStats(): Observable<Models.Favorites.FavoriteStats> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) {
            return of({ total_favorites: 0, folders_count: 0 });
        }

        const userFavorites = this.fakeFavorites.filter(f => f.user_id === currentUser.id);
        const userFolders = this.fakeFolders.filter(f => f.user_id === currentUser.id);

        const stats: Models.Favorites.FavoriteStats = {
            total_favorites: userFavorites.length,
            folders_count: userFolders.length
        };

        return of(stats);
    }

    /**
     * Elimina una carpeta y mueve sus favoritos a "Sin carpeta"
     */
    deleteFolder(folderId: string): Observable<boolean> {
        if (folderId === 'default') {
            console.error('No se puede eliminar la carpeta por defecto');
            return of(false);
        }

        const currentUser = this.authService.getUserProfile();
        if (!currentUser) return of(false);

        // Mover favoritos de esta carpeta a 'default'
        this.fakeFavorites.forEach(fav => {
            if (fav.user_id === currentUser.id && fav.folder === folderId) {
                fav.folder = 'default';
            }
        });

        // Eliminar carpeta
        this.fakeFolders = this.fakeFolders.filter(f => f._id !== folderId);
        this.saveToStorage();

        return of(true).pipe(delay(100));
    }
}
