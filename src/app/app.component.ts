import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';

interface Message {
  username?: string;
  message: string;
  time: string;
  type: 'message' | 'system';
  isBot?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  username = '';
  messageInput = '';
  messages: Message[] = [];
  onlineUsers: string[] = [];
  isJoined = false;
  isBotTyping = false;

  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {

    this.subscriptions.push(
      this.chatService.onBotTyping().subscribe((typing: boolean) => {
        this.isBotTyping = typing;
        this.scrollToBottom();
      })
    );
    this.subscriptions.push(
      this.chatService.onMessage().subscribe((data: any) => {
        this.messages.push(data);
        this.scrollToBottom();
      })
    );

    this.subscriptions.push(
      this.chatService.onUserJoined().subscribe((data: any) => {
        this.messages.push(data);
        this.scrollToBottom();
      })
    );

    this.subscriptions.push(
      this.chatService.onUserLeft().subscribe((data: any) => {
        this.messages.push(data);
        this.scrollToBottom();
      })
    );

    this.subscriptions.push(
      this.chatService.onOnlineUsers().subscribe((users: string[]) => {
        this.onlineUsers = users;
      })
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  joinChat(): void {
    if (this.username.trim()) {
      this.chatService.joinChat(this.username);
      this.isJoined = true;
    }
  }

  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.chatService.sendMessage(this.messageInput);
      this.messageInput = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  isMyMessage(msg: Message): boolean {
    return msg.username === this.username;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.disconnect();
  }
}