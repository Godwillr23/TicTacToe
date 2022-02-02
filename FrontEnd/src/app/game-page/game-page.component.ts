import { Component, ViewChild , OnInit } from '@angular/core';
import { Router } from '@angular/router';  
import { AppService } from '../app.service';  
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery" 

@Component({
  selector: 'app-game-page',
  providers:[AppService],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  // Declare vaiables

 userId = 0;
 username:any;
 challenger:any;
 gameCode = "";

 rowindex = 2;
 colindex = 2; 

 turn:any;
 turnUsername:any;

 gamePlayType:any;
 GameResults:any;
 PlayDate:any;
 GamePlayCode:any;

  constructor(
    private router:Router,
		private modalService: NgbModal,
		private appService: AppService,
    ) {}

  ngOnInit(): void {	

    if(sessionStorage.getItem("UserName") != null){
      this.username = sessionStorage.getItem("UserName");
	  this.challenger = "Player 2";
	  this.turn = this.username;
    }
    else{
      this.router.navigate(['/login']);  
    }

  }

  getLastPlayedGame(){

	this.appService.LatestGamePlayByUserId(this.username).subscribe(
		data => {
			this.gamePlayType = data.GamePlayType;
			this.GameResults = data.GameResults;
			this.PlayDate = data.DateCreated;
			this.GamePlayCode = data.GameCode;

			this.openModal('GameType','LastPlayedGame');
		}
	);
  }

  resumeGame(gameCode:any){
	this.appService.ResumeGame(gameCode).subscribe(
		data => {

			if(data){
				console.log(data.length);
				for(var i=0;i<data.length;i++){
					$("#"+data.MoveYX).css("background-color",data.BackColor);
					$("."+data.MoveYX).children().prop('disabled','disabled');
				}
			   this.openModal('LastPlayedGame','GamePlay');

			}
			else{
				this.openModal('LastPlayedGame','GamePlay');
			}
		}
	);
  }


  SinglePlay()
  {
	var backColor = "";
	var min = 0;
	var max = 9;
		
	 for(var i=0;i<9;i++){

		let num = Math.floor(Math.random() * (max - min)) + min;
		backColor = $("#td"+num).css("background-color");

		if(backColor == "rgba(0, 0, 0, 0)"){		
			setTimeout(() => {
				$("#td"+num).css("background-color","red");
				this.turn = this.username;

				setTimeout(() => {
					this.SaveYXMove("td"+num,"red");
					this.getWinner();
				}, 1000);

			}, 1000);
			break;
		}
		else {
			num = Math.floor(Math.random() * (max - min)) + min;
		}
	}
	
  }

  openModal(prevCard:any,newCard:any){
	$("."+prevCard).hide();
	$("."+newCard).show();
	
  }

  setDefaultChallenger(){
	this.challenger = "PC";
	this.SaveGamePlayType("Single-play");
	this.ResetGame();
  }

  SetChallengerUsername(){
	var username = $("#UserName").val();

	if(username == '')
	{
		this.challenger = "Player 2";
	}
	else{
		this.challenger = username;
	}

	this.SaveGamePlayType("Multi-play");
	this.ResetGame();
  }

  ResetGame(){
	  for(var i=0;i<10;i++)
	  {
		$(".td"+i).css("background-color","rgba(0, 0, 0, 0)");
		this.openModal('GameType','GamePlay');
		this.turn = this.username;
	  }
  }

  Gameclick(cellId:any, cellClass:any){

	var cId = $("#"+cellId).attr('class');
	var backColor = $("#"+cellId).css("background-color");


	if(backColor == "rgba(0, 0, 0, 0)"){

	  if(cellClass == cId){
		if(this.turn == this.username){
			$("#"+cellId).css("background-color","blue");
			$("."+cellId).children().prop('disabled','disabled');
			this.turn = this.challenger;
			this.SaveYXMove(cellId,"blue");

			if(this.challenger == "PC"){
				this.SinglePlay();
			}
			
			setTimeout(() => {
				this.getWinner();
			}, 1000);
		}
		else{
			$("#"+cellId).css("background-color","red");
			this.turn = this.username;
			this.SaveYXMove(cellId,"red");

			setTimeout(() => {
				this.getWinner();
			}, 1000);		
		}
	  }
	  
	  this.getCellOnClickCard(cellId);
	  
	}
  }
  
  generateGameCode(length:number){
	  var randomChars = "abcdefghijklmnopqrstuvwxyz123456789";
	  var results = "";

	  for(var i=0;i<length;i++)
	  {
		  results += randomChars.charAt(Math.random() * randomChars.length)
	  }

	  return results;

  }

  SaveGamePlayType(gameplayType:any){

	this.gameCode = this.generateGameCode(15);
	  
		this.appService.creategameplay({UserName:this.username, GameCode:this.gameCode, GamePlayType:gameplayType, GameResults:"Pending"}).subscribe(
		regdata => {      
			

			if(regdata.Status == "Success")    
			{       
				console.log("Created Success");
			}    
			else{    
				alert(regdata.Message);    
			}    
		},    
		error => {    
			alert(error.message);    
		});
  }

  SaveGame(){

	//var gameCode = sessionStorage.getItem("GameCode")+"";

	this.appService.savegameplay({GameCode:this.gameCode, Challenge:this.challenger}).subscribe(
	regdata => {     

		if(regdata.Status == "Success")    
		{       
			console.log("Created Success");
		}    
		else{    
			alert(regdata.Message);    
		}    
	},    
	error => {    
		alert(error.message);    
	});	
  }

  SaveYXMove(moveYX:any,backcolor:any){

	//var gameCode = sessionStorage.getItem("GameCode")+"";

	this.appService.playmove({GameCode:this.gameCode, MoveYX:moveYX, BackColor:backcolor}).subscribe(
	regdata => {     

		if(regdata.Status == "Success")    
		{       
			console.log("Created Success");
		}    
		else{    
			alert(regdata.Message);    
		}    
	},    
	error => {    
		alert(error.message);    
	});	
  }

   getCellOnClickCard(cellId:any){
	 var CellNo = 0;

		switch (cellId)
		{
			case cellId:
				CellNo = cellId.substring(3,2); 
			break;
		}	   
	
		return CellNo;
  }

  getWinner(){

	var Winner = "";

	var td1 = $("#td1").css("background-color");
	var td2 = $("#td2").css("background-color");
	var td3 = $("#td3").css("background-color");
	var td4 = $("#td4").css("background-color");
	var td5 = $("#td5").css("background-color");
	var td6 = $("#td6").css("background-color");
	var td7 = $("#td7").css("background-color");
	var td8 = $("#td8").css("background-color");
	var td9 = $("#td9").css("background-color");

	//Check if User is the winner
	if(td1 == "rgb(0, 0, 255)" && td2 == "rgb(0, 0, 255)" && td3 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}
	else if(td1 == "rgb(0, 0, 255)" && td4 == "rgb(0, 0, 255)" && td7 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}
	else if(td1 == "rgb(0, 0, 255)" && td5 == "rgb(0, 0, 255)" && td9 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}
	else if(td2 == "rgb(0, 0, 255)" && td5 == "rgb(0, 0, 255)" && td8 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}
	else if(td3 == "rgb(0, 0, 255)" && td6 == "rgb(0, 0, 255)" && td9 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}
	else if(td3 == "rgb(0, 0, 255)" && td5 == "rgb(0, 0, 255)" && td7 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}
	else if(td4 == "rgb(0, 0, 255)" && td5 == "rgb(0, 0, 255)" && td6 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}
	else if(td7 == "rgb(0, 0, 255)" && td8 == "rgb(0, 0, 255)" && td9 == "rgb(0, 0, 255)"){
		Winner = this.username;
	}

	//Check if Challenger or PC is the winner
	if(td1 == "rgb(255, 0, 0)" && td2 == "rgb(255, 0, 0)" && td3 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else if(td1 == "rgb(255, 0, 0)" && td4 == "rgb(255, 0, 0)" && td7 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else if(td1 == "rgb(255, 0, 0)" && td5 == "rgb(0255, 0, 0)" && td9 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else if(td2 == "rgb(255, 0, 0)" && td5 == "rgb(255, 0, 0)" && td8 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else if(td3 == "rgb(255, 0, 0)" && td6 == "rgb(255, 0, 0)" && td9 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else if(td3 == "rgb(255, 0, 0)" && td5 == "rgb(255, 0, 0)" && td7 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else if(td4 == "rgb(255, 0, 0)" && td5 == "rgb(255, 0, 0)" && td6 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else if(td7 == "rgb(255, 0, 0)" && td8 == "rgb(255, 0, 0)" && td9 == "rgb(255, 0, 0)"){
		Winner = this.challenger;
	}
	else{
		var allselected = false;

		for(var a=0; a<9; a++){

			if($("#td"+a).css("background-color") == "rgb(0, 0, 0)" )
			{
				allselected = false;
			}
			else{
				allselected = true;
			}
		}

		if(allselected == false)
		{
			Winner = "Draw";
		}
	}

	if(Winner == "Draw"){
		alert("It's a lovely Draw !!!");
		this.ResetGame();
	}
	else if(Winner == this.username || Winner == this.challenger){
		alert(Winner+" Won !!!");
		this.ResetGame();
	}

  }


  Logout(){
	this.appService.Logout(this.username).subscribe(    
		data => {    

			if(data.Status == "Success")    
			{  
				sessionStorage.removeItem('UserName');    
				sessionStorage.clear(); 
				this.router.navigate(['/login']); 
			}
	})
  }
}
