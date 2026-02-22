import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private serverUrl = 'https://chatwave-backend-536w.onrender.com';

  constructor() {
    this.socket = io(this.serverUrl);
  }

  joinChat(username: string): void {
    this.socket.emit('join', username);
  }

  sendMessage(message: string): void {
    this.socket.emit('send_message', { message });
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive_message', (data: any) => {
        observer.next(data);
      });
    });
  }

  onUserJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user_joined', (data: any) => {
        observer.next(data);
      });
    });
  }

  onUserLeft(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user_left', (data: any) => {
        observer.next(data);
      });
    });
  }

  onOnlineUsers(): Observable<string[]> {
    return new Observable(observer => {
      this.socket.on('online_users', (users: string[]) => {
        observer.next(users);
      });
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  onBotTyping(): Observable<boolean> {
  return new Observable(observer => {
    this.socket.on('bot_typing', (typing: boolean) => {
      observer.next(typing);
    });
  });
}
}
