import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';
import { AuthService } from 'src/app/core/services/auth';
import { AdminService } from 'src/app/admin/services/admin';
import { Models } from 'src/app/shared/models/models';

@Component({
    selector: 'app-chat-room',
    templateUrl: './chat-room.page.html',
    styleUrls: ['./chat-room.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatRoomPage implements OnInit {
    @ViewChild(IonContent) content!: IonContent;

    chatId: string = '';
    messages: Models.Chat.Message[] = [];
    otherUser: Models.User.User | null | undefined = null;
    currentUser: Models.User.User | null = null;
    newMessage = '';
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private chatService: ChatService,
        private authService: AuthService,
        private adminService: AdminService
    ) { }

    ngOnInit() {
        this.currentUser = this.authService.getUserProfile();
        this.chatId = this.route.snapshot.paramMap.get('id') || '';

        if (this.chatId) {
            this.loadChatData();
            this.subscribeToNewMessages();
        }
    }

    loadChatData() {
        this.isLoading = true;

        // Cargar mensajes
        this.chatService.getChatMessages(this.chatId).subscribe(messages => {
            this.messages = messages;
            this.isLoading = false;
            this.scrollToBottom();

            // Marcar como leídos
            if (this.currentUser) {
                this.chatService.markMessagesAsRead(this.chatId, this.currentUser.id).subscribe();
            }
        });

        // Cargar info del otro usuario
        this.chatService.getUserChats(this.currentUser!.id).subscribe(chats => {
            const currentChat = chats.find(c => c.id === this.chatId);
            if (currentChat) {
                const otherUserId = currentChat.participantIds.find(id => id !== this.currentUser!.id);
                if (otherUserId) {
                    this.adminService.getUserById(otherUserId).subscribe(user => {
                        this.otherUser = user;
                    });
                }
            }
        });
    }

    subscribeToNewMessages() {
        this.chatService.newMessage$.subscribe(message => {
            if (message && message.chatId === this.chatId) {
                // Solo añadir si no existe ya (evitar duplicados)
                if (!this.messages.find(m => m.id === message.id)) {
                    this.messages.push(message);
                    this.scrollToBottom();
                }
            }
        });
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;

        this.chatService.sendMessage(this.chatId, this.newMessage).subscribe(message => {
            this.newMessage = '';
            this.scrollToBottom();
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            this.content?.scrollToBottom(300);
        }, 100);
    }

    isSentByCurrentUser(message: Models.Chat.Message): boolean {
        return message.senderId === this.currentUser?.id;
    }
}
