import { Injectable } from '@angular/core';  
import {HttpClient} from '@angular/common/http';  
import {HttpHeaders} from '@angular/common/http';  
import { from, Observable } from 'rxjs';  
import { Register } from "../app/register";  
@Injectable({  
  providedIn: 'root'  
})  
export class LoginService {  
  Url :string;  
  //token : string;  
  header : any;  
  constructor(private http : HttpClient) {   
  
    this.Url = 'http://localhost:49444/api/account/';  
  
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  }  
  Login(model : any){  
     //var a =this.Url+'UserLogin';  
   return this.http.post<any>(this.Url+'Login',model,{ headers: this.header});  
  }  
  register(register:Register)  
   {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
    return this.http.post<any>(this.Url + '/Register/', register, httpOptions)  
   }  
}  