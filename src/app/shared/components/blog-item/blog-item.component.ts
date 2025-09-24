import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; // Para leer el ID de la URL
import { BlogService } from 'src/app/shared/services/blog';
import { Blog } from 'src/app/shared/models/blog.model';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss'],
    standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BlogItemComponent  implements OnInit {


  blog: Blog | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    // 1. Leemos el 'id' de la URL
    const blogId = this.route.snapshot.paramMap.get('id');

    if (blogId) {
      // 2. Usamos el id para pedir los datos del blog al servicio
      this.blogService.getBlogById(blogId).subscribe(data => {
        this.blog = data; // 3. Guardamos los datos del blog
        this.isLoading = false;
      });
    }
  }

}
