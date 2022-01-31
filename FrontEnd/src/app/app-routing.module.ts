import { NgModule } from '@angular/core';    
import { Routes, RouterModule } from '@angular/router';    
import { GamePageComponent } from './game-page/game-page.component';    
import { LoginComponent } from './login/login.component';    
import { RegisterComponent } from './register/register.component';    
    
export const routes: Routes = [    
  {    
    path: '',    
    redirectTo: 'login',    
    pathMatch: 'full',    
  },    
  {    
    path: 'login',    
    component: LoginComponent,    
    data: {    
      title: 'Login Page'    
    }    
  },    
  {    
    path: 'game-page',    
    component: GamePageComponent,    
    data: {    
      title: 'Game Play Page'    
    }    
  },    
  {    
    path: 'register',    
    component: RegisterComponent,    
    data: {    
      title: 'Add User Page'    
    }    
  },    
];    
    
@NgModule({    
  imports: [RouterModule.forRoot(routes)],    
  exports: [RouterModule]    
})    
export class AppRoutingModule { } 