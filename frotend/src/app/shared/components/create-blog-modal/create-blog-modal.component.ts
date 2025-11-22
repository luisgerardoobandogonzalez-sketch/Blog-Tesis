import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
@Component({
  selector: 'app-create-blog-modal',
  templateUrl: './create-blog-modal.component.html',
  styleUrls: ['./create-blog-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QuillModule]
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
    tagsInput: '', // Usaremos este campo temporal para los tags
    is_published: true // Por defecto, se publica
  };
  constructor(private modalCtrl: ModalController) { }
  // Función para cerrar el modal sin hacer nada
  cancel() {
    this.modalCtrl.dismiss();
  }
  // Función para "publicar" y cerrar el modal
  publish() {
    // Preparamos los datos para enviarlos
    const finalData = {
      ...this.blogData,
      // Convertimos el string de tags en un array, quitando espacios
      tags: this.blogData.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    delete (finalData as any).tagsInput; // Eliminamos la propiedad temporal
    console.log('Publicando blog:', finalData);
    // Cerramos el modal y enviamos los datos al componente que lo abrió
    this.modalCtrl.dismiss(finalData, 'confirm');
  }
}