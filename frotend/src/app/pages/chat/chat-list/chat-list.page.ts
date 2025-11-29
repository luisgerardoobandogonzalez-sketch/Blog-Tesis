import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';
import { AuthService } from 'src/app/core/services/auth';
import { AdminService } from 'src/app/admin/services/admin';
import { Models } from 'src/app/shared/models/models';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface ChatDisplay {
    chat: Models.Chat.ChatRoom;
    otherUser: Models.User.User | null | undefined;
}

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.page.html',
    styleUrls: ['./chat-list.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, RouterLink]
})
export class ChatListPage implements OnInit {
    chats: ChatDisplay[] = [];
    isLoading = true;
    currentUser: Models.User.User | null = null;

    constructor(
        private chatService: ChatService,
        private authService: AuthService,
        private adminService: AdminService
    ) { }

    ngOnInit() {
        this.currentUser = this.authService.getUserProfile();
        if (this.currentUser) {
            this.loadChats();
        }
    }

    loadChats() {
        this.isLoading = true;
        this.chatService.getUserChats(this.currentUser!.id).pipe(
            switchMap(chats => {
                if (chats.length === 0) return of([]);

                // Para cada chat, buscar el usuario que NO es el actual
                const tasks = chats.map(chat => {
                    const otherUserId = chat.participantIds.find(id => id !== this.currentUser!.id);
                    if (otherUserId) {
                        return this.adminService.getUserById(otherUserId).pipe(
                            map(user => ({ chat, otherUser: user }))
                        );
                    }
                    return of({ chat, otherUser: null });
                });

                return forkJoin(tasks);
            })
        ).subscribe(results => {
            this.chats = results;
            this.isLoading = false;
        });
    }
}
