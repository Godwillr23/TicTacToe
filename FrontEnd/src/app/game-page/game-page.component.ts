import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';    


@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

  username: any;
  constructor(private router:Router) { }

  ngOnInit(): void {

    if(sessionStorage.getItem("UserName") != null){
    this.username = sessionStorage.getItem("UserName");
    }
    else{
      this.router.navigate(['/login']);  
    }

  }

  Logout(){

    sessionStorage.removeItem('UserName');    
    sessionStorage.clear(); 
    this.router.navigate(['/login']);  
  }

}
