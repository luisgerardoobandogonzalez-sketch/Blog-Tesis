import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FavoritesService } from 'src/app/shared/services/favorites';
import { Models } from 'src/app/shared/models/models';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.page.html',
    styleUrls: ['./favorites.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class FavoritesPage implements OnInit, OnDestroy {

    public favoriteBlogs: Models.Blog.Blog[] = [];
    public folders: Models.Favorites.FavoriteFolder[] = [];
    public selectedFolder: string = 'all';
    public isLoading = true;
    public stats: Models.Favorites.FavoriteStats = { total_favorites: 0, folders_count: 0 };

    private favoritesSubscription?: Subscription;

    constructor(
        private favoritesService: FavoritesService,
        private router: Router,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.loadFolders();
        this.loadFavorites();
        this.loadStats();

        // Suscribirse a cambios en favoritos
        this.favoritesSubscription = this.favoritesService.favoritesChanged$.subscribe(() => {
            this.loadFavorites();
            this.loadStats();
        });
    }

    ngOnDestroy() {
        if (this.favoritesSubscription) {
            this.favoritesSubscription.unsubscribe();
        }
    }

    loadFolders() {
        this.favoritesService.getFolders().subscribe(folders => {
            this.folders = folders;
        });
    }

    loadFavorites() {
        this.isLoading = true;
        const folderId = this.selectedFolder === 'all' ? undefined : this.selectedFolder;

        this.favoritesService.getFavorites(folderId).subscribe(blogs => {
            this.favoriteBlogs = blogs;
            this.isLoading = false;
        });
    }

    loadStats() {
        this.favoritesService.getFavoriteStats().subscribe(stats => {
            this.stats = stats;
        });
    }

    onFolderChange(event: any) {
        this.selectedFolder = event.detail.value;
        this.loadFavorites();
    }

    viewBlog(blogId: string) {
        this.router.navigate(['/blog', blogId]);
    }

    removeFavorite(blogId: string, event: Event) {
        event.stopPropagation();

        this.favoritesService.unsaveBlog(blogId).subscribe(success => {
            if (success) {
                this.loadFavorites();
            }
        });
    }

    async createNewFolder() {
        const alert = await this.alertCtrl.create({
            header: 'Nueva Carpeta',
            inputs: [
                {
                    name: 'folderName',
                    type: 'text',
                    placeholder: 'Nombre de la carpeta',
                    attributes: {
                        maxlength: 30
                    }
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Crear',
                    handler: (data) => {
                        if (data.folderName && data.folderName.trim()) {
                            this.favoritesService.createFolder(data.folderName.trim()).subscribe(() => {
                                this.loadFolders();
                            });
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    async deleteFolder(folderId: string, event: Event) {
        event.stopPropagation();

        const alert = await this.alertCtrl.create({
            header: 'Eliminar Carpeta',
            message: 'Los favoritos de esta carpeta se moverán a "Sin carpeta"',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    handler: () => {
                        this.favoritesService.deleteFolder(folderId).subscribe(success => {
                            if (success) {
                                this.loadFolders();
                                if (this.selectedFolder === folderId) {
                                    this.selectedFolder = 'all';
                                }
                                this.loadFavorites();
                            }
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    getFolderCount(folderId: string): number {
        return this.favoriteBlogs.length;
    }
}
