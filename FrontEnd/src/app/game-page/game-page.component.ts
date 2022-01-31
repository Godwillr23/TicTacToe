import { Component, ViewChild , OnInit } from '@angular/core';
import { Router } from '@angular/router';  
import { AppService } from '../app.service';  
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-game-page',
  providers:[AppService],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

  // Declare vaiables

  username: any;
  public title = 'Tic Tac Toe Game';
	public gameGrid = <Array<Object>>[];
	public playedGameGrid = <Array<Object>>[];
	public movesPlayed = <number>0;
	public displayPlayerTurn = <Boolean>true;
	public myTurn = <Boolean>true;
	public whoWillStart = <Boolean>true;

	@ViewChild('content') public content: any;
	public modalOption: NgbModalOptions = {};

	public totalRooms = <Number> 0;
	public emptyRooms = <Array<number>> [];
	public roomNumber = <Number> 0;
	public playedText = <string>'';
	public whoseTurn = 'X';

  constructor(
    private router:Router,
		private modalService: NgbModal,
		private appService: AppService,
    ) {

      this.gameGrid = appService.gameGrid;
     }

  ngOnInit(): void {

    if(sessionStorage.getItem("UserName") != null){
      this.username = sessionStorage.getItem("UserName");
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      this.modalOption.size = 'lg';
      const localModalRef = this.modalService.open(this.content, this.modalOption);

      // connect the player to the socket
      this.appService.connectSocket();

      // HTTP call to get Empty rooms and total room numbers
      this.appService.getRoomStats().then((data:any) => {
        this.totalRooms = data['totalRoomCount'];
        this.emptyRooms = data['emptyRooms'];
      });

      // Socket evenet will total available rooms to play.
      this.appService.getRoomsAvailable().subscribe((data:any) => {
        this.totalRooms = data['totalRoomCount'];
        this.emptyRooms = data['emptyRooms'];
      });

      // Socket evenet to start a new Game
      this.appService.startGame().subscribe((data:any) => {
        localModalRef.close();
        this.roomNumber = data['roomNumber'];
      });

      // Socket event will receive the Opponent player's Move
      this.appService.receivePlayerMove().subscribe((data:any) => {
        this.opponentMove(data);
      });

      // Socket event to check if any player left the room, if yes then reload the page.
      this.appService.playerLeft().subscribe((data:any) => {
        alert('Player Left');
        window.location.reload();
      });
    }
    else{
      this.router.navigate(['/login']);  
    }

  }

  
	 //Method to join the new Room by passing Romm Number
	 
	joinRoom(roomNumber:any) {
		this.myTurn = false;
		this.whoWillStart = false;
		this.whoseTurn = 'O';
		this.appService.joinNewRoom(roomNumber);
	}

	//create new room

	createRoom() {
		this.myTurn = true;
		this.whoseTurn = 'X';
		this.whoWillStart = true;
		this.appService.createNewRoom().subscribe( (data:any) => {
			this.roomNumber = data.roomNumber;
		});
	}


//This method will be called by the socket event subscriber to make the Opponent players moves
	opponentMove(params:any) {
		this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
		if (params['winner'] ===  null) {
			this.playedGameGrid[params['position']] = {
				position: params['position'],
				player: params['playedText']
			};
			this.myTurn = true;
		}else {
			alert(params['winner']);
			this.resetGame();
		}
	}

	//This method will be called when the current user tries to play his/her move

	play(number:any) {
		if (!this.myTurn) {
			return;
		}
		this.movesPlayed += 1;
		this.playedGameGrid[number] = {
			position: number,
			player: this.whoseTurn
		};
		this.appService.sendPlayerMove({
			'roomNumber' : this.roomNumber,
			'playedText': this.whoseTurn,
			'position' : number,
			'playedGameGrid': this.playedGameGrid,
			'movesPlayed' : this.movesPlayed
		});
		this.myTurn = false;
		this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
	}

	 //This method will be used to render the data between the Grids.

	renderPlayedText(number:any) {
		if (this.playedGameGrid[number] === undefined) {
			return '';
		}else {
			//this.playedText = this.playedGameGrid[number]['player'];
			return this.playedText;
		}
	}

	//method to reset the game.

	resetGame() {
		this.playedGameGrid = [];
		this.gameGrid = [];
		this.gameGrid = this.appService.gameGrid;
		this.movesPlayed = 0;
		if (this.whoWillStart) {
			this.myTurn = true;
			this.displayPlayerTurn = true;
			this.whoseTurn = 'X';
		}else {
			this.displayPlayerTurn = true;
			this.whoseTurn = 'O';
		}
	}

  Logout(){

    sessionStorage.removeItem('UserName');    
    sessionStorage.clear(); 
    this.router.navigate(['/login']);  
  }

}
