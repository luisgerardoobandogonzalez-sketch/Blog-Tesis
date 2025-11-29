import { Component, Input, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Models } from 'src/app/shared/models/models';

@Component({
  selector: 'app-edit-blog-modal',
  templateUrl: './edit-blog-modal.component.html',
  styleUrls: ['./edit-blog-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class EditBlogModalComponent implements OnInit {
  // Recibe los datos del blog a editar desde la página de detalle
  @Input() blogToEdit!: Models.Blog.Blog;

  // Creamos una copia local para no modificar el original hasta guardar
  blogData: any = {};

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // Hacemos una copia de los datos para el formulario
    this.blogData = { ...this.blogToEdit };
    // Convertimos el array de tags a un string para el input
    this.blogData.tagsInput = this.blogData.tags.join(', ');
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  publish() {
    // Preparamos los datos para devolverlos
    const finalData = {
      ...this.blogData,
      tags: this.blogData.tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    };
    delete finalData.tagsInput;

    // Cerramos el modal y devolvemos los datos actualizados
    this.modalCtrl.dismiss(finalData, 'confirm');
  }
}