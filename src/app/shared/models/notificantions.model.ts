export namespace NotificationModels{

export interface Notification {
  _id: string;
  recipient_id: string;
  sender_id: string;
  type: 'like' | 'comment' | 'share' | 'follow' | 'mention';
  message: string;
  data: {
    url: string; // URL a la que se navegará al hacer clic
  };
  is_read: boolean;
  created_at: string;
}

}