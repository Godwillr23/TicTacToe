import { Component, OnInit } from '@angular/core';    
import { Router } from '@angular/router';    
import { AppService } from '../app.service';    
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';    
    
@Component({    
  selector: 'app-login',    
  templateUrl: './login.component.html',    
  styleUrls: ['./login.component.scss']    
})    

export class LoginComponent {    
    
  model : any={};  
  public UserForm: any;  

    
  errorMessage!: string;    
  constructor(
    private router:Router,
    private appService:AppService,
    private formbulider: FormBuilder
    ) { }    
    
    
  ngOnInit() {    

    this.UserForm = this.formbulider.group({    
      UserName: ['', [Validators.required]],    
      Passward: ['', [Validators.required]]  
    }); 
  
  } 

  login(){    

    this.appService.Login(this.model).subscribe(    
      data => {    
        if(data.Status == "Success")    
        {       
          sessionStorage.setItem("UserName",this.model.UserName);   
          this.router.navigate(['/game-page']);     
        }    
        else{    
          this.errorMessage = data.Message;    
        }    
      },    
      error => {    
        this.errorMessage = error.message;    
      });    
}}     