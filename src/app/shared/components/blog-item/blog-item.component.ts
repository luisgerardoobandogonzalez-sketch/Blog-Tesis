import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; 
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { AuthService } from 'src/app/core/services/auth'; // <-- Importa AuthService
import { AuthModalComponent } from 'src/app/shared/components/auth-modal/auth-modal.component'; // <-- Importa el Modal
import { take } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { EditBlogModalComponent } from 'src/app/shared/components/edit-blog-modal/edit-blog-modal.component';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss'],
    standalone: true,
  imports: [IonicModule, CommonModule,CommentSectionComponent]
})
export class BlogItemComponent  implements OnInit {


  blog: Models.Blog.Blog | null = null;
  isLoading = true;
  currentUser: Models.User.User | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private AuthService: AuthService,     // <-- Inyéctalo
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // 1. Leemos el 'id' de la URL
    const blogId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.AuthService.getUserProfile();

    if (blogId) {
      // 2. Usamos el id para pedir los datos del blog al servicio
      this.blogService.getBlogById(blogId).subscribe(data => {
        this.blog = data; // 3. Guardamos los datos del blog
        this.isLoading = false;

    console.log('--- BlogItemComponent ---');
    console.log('ID del Usuario Actual:', this.currentUser?.id);
    console.log('ID del Autor del Blog:', this.blog?.author_id);
    console.log('¿Los IDs son iguales?:', this.currentUser?.id === this.blog?.author_id);
    console.log('-------------------------');

      });
    }
  }

  toggleLike() {
    if (!this.blog) return;

    this.AuthService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        // Si está autenticado, ejecuta la lógica de siempre
        if (this.blog!.currentUserHasLiked) {
          this.blogService.unlikeBlog(this.blog!._id).subscribe();
        } else {
          this.blogService.likeBlog(this.blog!._id).subscribe();
        }
      } else {
        // Si no, abre el modal de login
        this.openAuthModal();
      }
    });
  }
  
  // --- NUEVA FUNCIÓN DE AYUDA ---
  async openAuthModal() {
    const modal = await this.modalCtrl.create({
      component: AuthModalComponent,
    });
    await modal.present();
  }


 async openEditModal() {
    if (!this.blog) return;

    const modal = await this.modalCtrl.create({
      component: EditBlogModalComponent,
      componentProps: {
        blogToEdit: this.blog // Pasamos los datos del blog al modal
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // Si se guardan los cambios, llama al servicio
      this.blogService.updateBlog(this.blog._id, data).subscribe(updatedBlog => {
        this.blog = updatedBlog; // Actualiza la vista con el blog editado
      });
    }
  }

}
