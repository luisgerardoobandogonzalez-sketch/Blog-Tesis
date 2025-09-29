import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { EditBlogModalComponent } from 'src/app/shared/components/edit-blog-modal/edit-blog-modal.component';

@Component({
  selector: 'app-manage-blogs',
  templateUrl: './manage-blogs.page.html',
  styleUrls: ['./manage-blogs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ManageBlogsPage implements OnInit {
  allBlogs: Models.Blog.Blog[] = [];
  isLoading = true;

  constructor(
    private blogService: BlogService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;
    this.blogService.getAllBlogsForAdmin().subscribe(data => {
      this.allBlogs = data;
      this.isLoading = false;
    });
  }

  async editBlog(blog: Models.Blog.Blog, event: Event) {
    event.stopPropagation(); // Evita que se active la navegación del ítem
    
    const modal = await this.modalCtrl.create({
      component: EditBlogModalComponent,
      componentProps: {
        blogToEdit: blog
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.blogService.updateBlog(blog._id, data).subscribe(updatedBlog => {
        // Actualiza la lista sin recargar toda la página
        const index = this.allBlogs.findIndex(b => b._id === updatedBlog._id);
        if (index > -1) {
          this.allBlogs[index] = updatedBlog;
        }
      });
    }
  }

  approveBlog(blog:  Models.Blog.Blog) {
    this.blogService.updateBlogModeration(blog._id, 'approved').subscribe();
  }
  
  rejectBlog(blog:  Models.Blog.Blog) {
    this.blogService.updateBlogModeration(blog._id, 'rejected').subscribe();
  }

  toggleFeatured(blog:  Models.Blog.Blog) {
    this.blogService.toggleFeaturedStatus(blog._id).subscribe();
  }

  async deleteBlog(blog:  Models.Blog.Blog) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar el post "${blog.title}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.blogService.deleteBlog(blog._id).subscribe(() => this.loadBlogs());
          },
        },
      ],
    });
    await alert.present();
  }
}