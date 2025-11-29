export namespace ChatModels {
    export interface Message {
        id: string;
        chatId: string;
        senderId: string;
        content: string;
        timestamp: string;
        isRead: boolean;
    }

    export interface ChatRoom {
        id: string;
        participantIds: string[];
        lastMessage?: Message;
        updatedAt: string;
    }
}
