import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { CoordinateDto } from './dto/coordinate.dto';

config();

@WebSocketGateway({
  cors: {
    origin: [process.env.CLIENT_URL_DEV, process.env.CLIENT_URL_PROD],
  },
})
export class LocationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  joinRoom(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
  ): string {
    client.join(data.toString());

    return `Joined Room ${data}`;
  }

  @SubscribeMessage('location_update')
  async sendCoordinate(
    @MessageBody() coordinate: CoordinateDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(coordinate.orderId.toString()).emit('new_coordinate', coordinate);
  }
}
