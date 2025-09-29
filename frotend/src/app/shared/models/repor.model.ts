export namespace ReportModel{
export interface Report {
  _id: string;
  reporter_id: string;
  reported_content_id: string;
  content_type: 'blog' | 'comment';
  reported_user_id: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'copyright';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

}