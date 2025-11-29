import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { TagSelectorComponent } from '../tag-selector/tag-selector.component';

@Component({
  selector: 'app-create-blog-modal',
  templateUrl: './create-blog-modal.component.html',
  styleUrls: ['./create-blog-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, QuillModule, TagSelectorComponent]
})
export class CreateBlogModalComponent {
  // Configuración del editor Quill
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };
  // Objeto para vincular los datos del formulario con [(ngModel)]
  blogData = {
    title: '',
    content: '',
    career: '',
    tags: [] as string[], // Ahora es un array de strings
    is_published: true // Por defecto, se publica
  };
  constructor(private modalCtrl: ModalController) { }
  // Función para cerrar el modal sin hacer nada
  cancel() {
    this.modalCtrl.dismiss();
  }

  onTagsChange(tags: string[]) {
    this.blogData.tags = tags;
  }

  // Función para "publicar" y cerrar el modal
  publish() {
    // Preparamos los datos para enviarlos
    const finalData = {
      ...this.blogData
    };

    console.log('Publicando blog:', finalData);
    // Cerramos el modal y enviamos los datos al componente que lo abrió
    this.modalCtrl.dismiss(finalData, 'confirm');
  }
}