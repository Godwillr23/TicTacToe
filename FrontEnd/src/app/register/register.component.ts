import { Component, OnInit } from '@angular/core';    
import { AppService } from '../app.service';    
import {Register} from '../register';    
import {Observable} from 'rxjs';    
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';    
    
@Component({    
  selector: 'app-register',    
  templateUrl: './register.component.html',    
  styleUrls: ['./register.component.scss']    
})    
export class RegisterComponent implements OnInit {  

  data = false;    
  public UserForm: any;    
  public message: any;    
  errorMessage!: string;

  constructor(
    private formbulider: FormBuilder,
    private appService:AppService) 
  { }    
    
  ngOnInit() {    
    this.UserForm = this.formbulider.group({    
      UserName: ['', [Validators.required]],    
      Password: ['', [Validators.required]]  
    });    
  }   

   
  onFormSubmit()    
  {    
    const user = this.UserForm.value;    
    this.register(user);    
  }  
  
  register(register:Register)    
  {    
    this.message = '';
    this.errorMessage = '';

      this.appService.register(register).subscribe(
      regdata => {        
        if(regdata.Status == "Success")    
        {       
          this.data = true;    
          this.message = 'Saved Successfully';    
          this.UserForm.reset();        
        }    
        else{    
          this.errorMessage = regdata.Message;    
        }    
      },    
      error => {    
        this.errorMessage = error.message;    
      });    
   
  }    
}    