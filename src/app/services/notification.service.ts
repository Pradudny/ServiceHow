import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private abortController: AbortController | null = null;
  private notificationsSubject = new Subject<Notification>();
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  connect(): void {
    console.log('NotificationService: connect() called');
    if (this.abortController) {
      this.disconnect();
    }

    const token = sessionStorage.getItem('authToken');
    console.log('NotificationService: token found:', !!token);
    if (!token) {
      console.error('No auth token found');
      return;
    }

    this.abortController = new AbortController();
    console.log('NotificationService: making fetch request');

    fetch('/api/notifications/subscribe', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream'
      },
      signal: this.abortController.signal
    }).then(response => {
      console.log('NotificationService: fetch response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return this.handleStream(response);
    }).catch(error => {
      if (error.name !== 'AbortError') {
        console.error('SSE connection error:', error);
      }
    });
  }

  private async handleStream(response: Response): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let eventType = '';
        let data = '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            data = line.slice(5).trim();
          } else if (line.trim() === '') {
            // End of event, process it
            if (eventType === 'notification' && data) {
              try {
                const notificationData = JSON.parse(data);
                const notification: Notification = {
                  id: Date.now(), // Use timestamp as ID since backend doesn't provide one
                  message: this.formatNotificationMessage(notificationData),
                  type: this.mapNotificationType(notificationData.type),
                  timestamp: new Date().toISOString(),
                  read: false
                };
                this.notificationsSubject.next(notification);
              } catch (error) {
                console.error('Error parsing notification:', error);
              }
            }
            // Reset for next event
            eventType = '';
            data = '';
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Stream reading error:', error);
      }
    }
  }

  private formatNotificationMessage(data: any): string {
    switch (data.type) {
      case 'INCIDENT_COMPLETED':
        return `Incident "${data.data.title}" has been completed`;
      default:
        return `Notification: ${data.type}`;
    }
  }

  private mapNotificationType(type: string): 'info' | 'warning' | 'error' | 'success' {
    switch (type) {
      case 'INCIDENT_COMPLETED':
        return 'success';
      default:
        return 'info';
    }
  }

  disconnect(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
