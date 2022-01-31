import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import io from 'socket.io-client';
import {Http, RequestOptions,Headers} from '@angular/http';

@Injectable()
export class AppService {
	public gameGrid = <Array<Object>>[[1, 2, 3], [4, 5, 6], [7, 8, 9]];
	public BASE_URL = 'http://localhost:4000';
	public socket:any;

  constructor(
    private http:Http,
    ) {}

	private headerOptions = new RequestOptions({
		headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
	});

	//SocketEvent and HTTP call. 

	public getRoomStats() {
		return new Promise(resolve => {
			this.http.get(`http://localhost:4000/getRoomStats`).subscribe((data:any) => {
				resolve(data);
			});
		});
	}
	
	// connect the users to socket
	
	connectSocket() {
		this.socket = (io as any)(this.BASE_URL);
	}

	//receive available event.
	getRoomsAvailable(): any {
		const observable = new Observable((observer:any) => {
			this.socket.on('rooms-available', (data:any) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}

	///create new room
	createNewRoom(): any {
		this.socket.emit('create-room', { 'test': 9909 });
		const observable = new Observable((observer:any) => {
			this.socket.on('new-room', (data:any) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}


	//join new room
	joinNewRoom(roomNumber:any): any {
		this.socket.emit('join-room', { 'roomNumber': roomNumber });
	}

	//receive start-game event.
	startGame(): any {
		const observable = new Observable((observer:any) => {
			this.socket.on('start-game', (data:any) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}

	//join new room, create-room event.
	sendPlayerMove(params:any) {
		this.socket.emit('send-move', params);
	}

	//receive start-game event.
	receivePlayerMove(): any {
		const observable = new Observable((observer:any) => {
			this.socket.on('receive-move', (data:any) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}
	// check if any player is leaving the game.
	playerLeft(): any {
		const observable = new Observable((observer:any) => {
			this.socket.on('room-disconnect', (data:any) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}
}
