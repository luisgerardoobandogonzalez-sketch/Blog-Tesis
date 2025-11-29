import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { AuthService } from 'src/app/core/services/auth';
import { AuthModalComponent } from 'src/app/shared/components/auth-modal/auth-modal.component';
import { take } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { EditBlogModalComponent } from 'src/app/shared/components/edit-blog-modal/edit-blog-modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CommentSectionComponent]
})
export class BlogItemComponent implements OnInit {

  sanitizedContent?: SafeHtml;
  blog: Models.Blog.Blog | null = null;
  isLoading = true;
  currentUser: Models.User.User | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private AuthService: AuthService,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const blogId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.AuthService.getUserProfile();

    if (blogId) {
      this.blogService.getBlogById(blogId).subscribe(data => {
        this.blog = data;
        this.isLoading = false;

        if (this.blog) {
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.blog.content);
        }
      });
    }
  }

  toggleLike() {
    if (!this.blog) return;

    this.AuthService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        if (this.blog!.currentUserHasLiked) {
          this.blogService.unlikeBlog(this.blog!._id).subscribe();
        } else {
          this.blogService.likeBlog(this.blog!._id).subscribe();
        }
      } else {
        this.openAuthModal();
      }
    });
  }

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
        blogToEdit: this.blog
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.blogService.updateBlog(this.blog._id, data).subscribe(updatedBlog => {
        this.blog = updatedBlog;
      });
    }
  }

  async exportToPDF() {
    if (!this.blog) return;

    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      const content = document.getElementById('blog-content');
      if (!content) return;

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${this.blog.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  }
}
