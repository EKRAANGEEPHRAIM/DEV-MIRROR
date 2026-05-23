import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { ChatService } from './chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedUsers = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Client connection
  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization.split('')[1];

      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // store user id
      client.userId = payload.sub;
      this.connectedUsers.set(payload.sub, client.id);

      // join his personnal room

      client.join(`user:${payload.sub}`);

      //Broadcast to all users that a new user has connected
      this.server.emit('user_connected', {
        userId: payload.sub,
        timestamp: new Date(),
      });

      console.log('User connected:', payload.sub);
    } catch {
      client.disconnect();
    }
  }

  //Deconnexion

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      this.connectedUsers.delete(userId);
      this.server.emit('user_disconnected', {
        userId,
      });
    }
  }

  // join conversation

  @SubscribeMessage('conversation: join')
  async handleJoinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`conversation:${data.conversationId}`);

    //Mard as readed

    await this.chatService.markAsReaded(
      data.conversationId,
      client.data.userId,
    );

    client.emit('conversation: joined', {
      conversationId: data.conversationId,
    });
  }

  //go out of conversation

  @SubscribeMessage('conversation: leave')
  async handleLeaveConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`conversation:${data.conversationId}`);
  }

  // send a message
  @SubscribeMessage('message: send')
  async handleMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.content?.trim()) {
      return;
    }

    const message = await this.chatService.saveMessage(
      data.conversationId,
      client.data.userId,
      data.content.trim(),
    );

    //broadcast the message to the conversation room
    this.server.to(`conversation:${data.conversationId}`).emit('message: received', message);
 
 
 // handle typing
 @SubscribeMessage('typing: start')
 async handleTyping(
   @MessageBody() data: { conversationId: string },
   @ConnectedSocket() client: Socket,
 ) {
    this.server.to(`conversation:${data.conversationId}`).emit('message: typing', {
      userId: client.data.userId,
      
    });
  }



  @SubscribeMessage('typing: stop')
  async handleStopTyping(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`conversation:${data.conversationId}`).emit('message: typing', {
      userId: client.data.userId,
      
    });
  }
}


//check if an user is online

isUserOnline(userId : string): boolean {
    return this.connectedUsers.has(userId);
}
}
