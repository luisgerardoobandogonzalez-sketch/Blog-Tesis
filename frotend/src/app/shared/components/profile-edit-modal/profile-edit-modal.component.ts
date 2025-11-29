import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Models } from 'src/app/shared/models/models';

@Component({
    selector: 'app-profile-edit-modal',
    templateUrl: './profile-edit-modal.component.html',
    styleUrls: ['./profile-edit-modal.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfileEditModalComponent implements OnInit {
    @Input() user!: Models.User.User;
    profileForm!: FormGroup;

    constructor(
        private modalCtrl: ModalController,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.profileForm = this.fb.group({
            firstName: [this.user.firstName, [Validators.required]],
            lastName: [this.user.lastName, [Validators.required]],
            bio: [this.user.bio || '', [Validators.maxLength(500)]],
            profile_picture_url: [this.user.profile_picture_url || ''],
            career: [this.user.career || ''],
            linkedin: [this.user.social_links?.linkedin || ''],
            github: [this.user.social_links?.github || ''],
            twitter: [this.user.social_links?.twitter || '']
        });
    }

    cancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }

    confirm() {
        if (this.profileForm.valid) {
            const formValue = this.profileForm.value;

            // Reconstruir el objeto User con los cambios
            const updatedUser: Partial<Models.User.User> = {
                ...this.user,
                firstName: formValue.firstName,
                lastName: formValue.lastName,
                bio: formValue.bio,
                profile_picture_url: formValue.profile_picture_url,
                career: formValue.career,
                social_links: {
                    linkedin: formValue.linkedin,
                    github: formValue.github,
                    twitter: formValue.twitter
                }
            };

            this.modalCtrl.dismiss(updatedUser, 'confirm');
        }
    }
}
