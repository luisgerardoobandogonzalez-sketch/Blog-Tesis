import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Models } from '../models/models';
import { AuthService } from 'src/app/core/services/auth';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private chatsKey = 'app_chats';
    private messagesKey = 'app_messages';

    private chats: Models.Chat.ChatRoom[] = [];
    private messages: Models.Chat.Message[] = [];

    private newMessageSource = new BehaviorSubject<Models.Chat.Message | null>(null);
    newMessage$ = this.newMessageSource.asObservable();

    constructor(private authService: AuthService) {
        this.loadData();
    }

    private loadData() {
        const savedChats = localStorage.getItem(this.chatsKey);
        const savedMessages = localStorage.getItem(this.messagesKey);

        if (savedChats) this.chats = JSON.parse(savedChats);
        if (savedMessages) this.messages = JSON.parse(savedMessages);
    }

    private saveData() {
        localStorage.setItem(this.chatsKey, JSON.stringify(this.chats));
        localStorage.setItem(this.messagesKey, JSON.stringify(this.messages));
    }

    // Obtener chats donde participa el usuario
    getUserChats(userId: string): Observable<Models.Chat.ChatRoom[]> {
        const userChats = this.chats.filter(chat => chat.participantIds.includes(userId));
        // Ordenar por fecha de actualización descendente
        userChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        return of(userChats).pipe(delay(200));
    }

    // Obtener mensajes de un chat específico
    getChatMessages(chatId: string): Observable<Models.Chat.Message[]> {
        const chatMessages = this.messages.filter(m => m.chatId === chatId);
        chatMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return of(chatMessages).pipe(delay(100));
    }

    // Crear un nuevo chat o devolver uno existente
    createChat(participantIds: string[]): Observable<Models.Chat.ChatRoom> {
        // Buscar si ya existe un chat con estos participantes exactos
        const existingChat = this.chats.find(chat =>
            chat.participantIds.length === participantIds.length &&
            participantIds.every(id => chat.participantIds.includes(id))
        );

        if (existingChat) {
            return of(existingChat);
        }

        const newChat: Models.Chat.ChatRoom = {
            id: `chat_${Date.now()}`,
            participantIds: participantIds,
            updatedAt: new Date().toISOString()
        };

        this.chats.unshift(newChat);
        this.saveData();
        return of(newChat);
    }

    // Enviar un mensaje
    sendMessage(chatId: string, content: string): Observable<Models.Chat.Message> {
        const currentUser = this.authService.getUserProfile();
        if (!currentUser) throw new Error('User not authenticated');

        const newMessage: Models.Chat.Message = {
            id: `msg_${Date.now()}`,
            chatId: chatId,
            senderId: currentUser.id,
            content: content,
            timestamp: new Date().toISOString(),
            isRead: false
        };

        this.messages.push(newMessage);

        // Actualizar el chat con el último mensaje
        const chatIndex = this.chats.findIndex(c => c.id === chatId);
        if (chatIndex > -1) {
            this.chats[chatIndex].lastMessage = newMessage;
            this.chats[chatIndex].updatedAt = newMessage.timestamp;
        }

        this.saveData();
        this.newMessageSource.next(newMessage);

        return of(newMessage).pipe(delay(100));
    }

    // Marcar mensajes como leídos
    markMessagesAsRead(chatId: string, userId: string): Observable<boolean> {
        let updated = false;
        this.messages.forEach(msg => {
            if (msg.chatId === chatId && msg.senderId !== userId && !msg.isRead) {
                msg.isRead = true;
                updated = true;
            }
        });

        if (updated) this.saveData();
        return of(true);
    }
}
