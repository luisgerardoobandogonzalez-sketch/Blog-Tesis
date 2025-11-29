import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommentService } from 'src/app/shared/services/comment';
import { AuthService } from 'src/app/core/services/auth';
import { Models } from 'src/app/shared/models/models';
import { ModalController } from '@ionic/angular';
import { AuthModalComponent } from 'src/app/shared/components/auth-modal/auth-modal.component';
import { take } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CommentSectionComponent implements OnInit {
  @Input() blogId!: string;
  @Input() blogAuthorId!: string;

  allComments: Models.Comment.Comment[] = [];
  rootComments: Models.Comment.Comment[] = [];
  newCommentText = '';

  replyingTo: string | null = null;
  replyText = '';

  isAuthenticated$: Observable<boolean>;
  currentUser: Models.User.User | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser = this.authService.getUserProfile();
  }

  ngOnInit() {
    this.loadComments();
    this.commentService.commentAdded$.subscribe(() => this.loadComments());
  }

  loadComments() {
    this.commentService.getComments(this.blogId).subscribe(data => {
      this.allComments = data;
      this.rootComments = data.filter(c => !c.parent_comment_id);
    });
  }

  getReplies(commentId: string): Models.Comment.Comment[] {
    return this.allComments.filter(c => c.parent_comment_id === commentId);
  }

  postComment() {
    if (!this.newCommentText.trim()) return;
    this.commentService.postComment(this.blogId, this.newCommentText).subscribe(() => {
      this.newCommentText = '';
    });
  }

  postReply(parentId: string) {
    if (!this.replyText.trim()) return;
    this.commentService.postComment(this.blogId, this.replyText, parentId).subscribe(() => {
      this.replyText = '';
      this.replyingTo = null;
    });
  }

  toggleReplyBox(commentId: string) {
    if (this.replyingTo === commentId) {
      this.replyingTo = null;
    } else {
      this.replyingTo = commentId;
      this.replyText = '';
    }
  }

  handleCommentPost() {
    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        this.postComment();
      } else {
        this.openAuthModal();
      }
    });
  }

  handleReplyPost(parentId: string) {
    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        this.postReply(parentId);
      } else {
        this.openAuthModal();
      }
    });
  }

  toggleLike(comment: Models.Comment.Comment) {
    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        this.commentService.toggleLike(comment._id).subscribe(() => {
          // Feedback visual inmediato si fuera necesario
        });
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

  canDelete(comment: Models.Comment.Comment): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.id === this.blogAuthorId || this.currentUser.id === comment.author_id;
  }

  async presentDeleteConfirm(commentId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este comentario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.commentService.deleteComment(commentId).subscribe();
          },
        },
      ],
    });
    await alert.present();
  }
}