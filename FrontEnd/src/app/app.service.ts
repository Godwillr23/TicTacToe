import { Injectable } from '@angular/core';  
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';  
import { from, Observable } from 'rxjs';  
import { Register } from "../app/register";  
import { GamePlay } from './game-play.model';
import { SaveGame } from './save-game.model';
import { GameMove } from './game-move.model';
@Injectable({  
  providedIn: 'root'  
}) 

@Injectable()
export class AppService {
	Url :string;  
  //token : string;  
  header : any;  
  constructor(private http : HttpClient) {   
  
    this.Url = 'http://godwillrikh23-001-site1.itempurl.com/';  
  
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  }  
  Login(model : any){  
    return this.http.post<any>(this.Url+'api/account/Login',model,{ headers: this.header}); 
  }  

  register(register:Register)  
  {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
    return this.http.post<any>(this.Url + 'api/account/Register/', register, httpOptions);  
  }  

  Logout(username:any){  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }; 
    return this.http.post<any>(this.Url + 'api/account/Logout?username='+ username, httpOptions) ;  
  }  

//   getUserId(username : any){  
//     return this.http.post<any>(this.Url + 'api/account/getUserId?username='+ username,{ headers: this.header}) ; 
//   } 

  creategameplay(creategameplay:GamePlay)  
  {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
    return this.http.post<any>(this.Url + 'api/gameplay/CreateGamePlay/', creategameplay, httpOptions);  
  } 

//   getGamePlayId(userId : any){  
//     return this.http.post<any>(this.Url + 'api/gameplay/getGamePlayId?userId='+ userId,{ headers: this.header}) ; 
//   } 

  savegameplay(savegame:SaveGame)  
  {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
    return this.http.post<any>(this.Url + 'api/gameplay/saveGamePlay/', savegame, httpOptions); 
  } 

  playmove(move:GameMove)  
  {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
    return this.http.post<any>(this.Url + 'api/gameplay/PlayMove/', move, httpOptions);  
  } 

  LatestGamePlayByUserId(username : any){ 
     return this.http.post<any>(this.Url + 'api/gameplay/LatestGamePlayByUserId?username='+ username,{ headers: this.header}) ; 
} 

ResumeGame(gameCode : any){ 
   return this.http.post<any>(this.Url + 'api/gameplay/ResumeGame?gameCode='+ gameCode,{ headers: this.header}) ; 
} 

SavedGame(gameCode : any){ 
   return this.http.post<any>(this.Url + 'api/gameplay/SavedGame?gameCode='+ gameCode,{ headers: this.header}) ; 
} 

} 