export namespace NotificationModels {

  export interface Notification {
    _id: string;
    recipient_id: string;
    sender_id: string;
    type: 'like' | 'comment' | 'share' | 'follow' | 'mention' | 'level_up' | 'badge_earned';
    message: string;
    data: {
      url: string; // URL a la que se navegará al hacer clic
    };
    is_read: boolean;
    created_at: string;
  }

}