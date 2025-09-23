import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/blog';
import { Blog } from 'src/app/shared/models/blog.model';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {

  public blogs: Blog[] = [];
  public isLoading = true; // Variable para mostrar un indicador de carga

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true; // Empezamos a cargar
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data; // Guardamos los blogs
        this.isLoading = false; // Terminamos de cargar
      },
      error: (err) => {
        console.error('Error al cargar los blogs', err);
        this.isLoading = false; // Terminamos de cargar incluso si hay error
      }
    });
  }

  // Esta función te servirá para cuando el usuario haga clic en un blog
  viewBlogDetail(blogId: string) {
    // De momento solo lo mostramos en consola, luego lo navegarás a la página de detalle
    console.log('Navegar al blog con ID:', blogId);
    // this.router.navigate(['/blog', blogId]);
  }
}
