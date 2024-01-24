import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ContainerComponent } from './components/container/container.component';
import { SignupComponent } from './components/signup/signup.component';
import { TasklistComponent } from './components/tasklist/tasklist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material';
import { TaskaddService } from './services/taskadd.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { UsersComponent } from './components/users/users.component';
import { AddcollaboratorService } from './services/addcollaborator.service';
import { SigninComponent } from './components/signin/signin.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TaskComponent } from './components/task/task.component';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AddcollabComponent } from './components/addcollab/addcollab.component';
import { CommentService } from './services/comment.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContainerComponent,
    SignupComponent,
    TasklistComponent,
    UserComponent,
    UsersComponent,
    SigninComponent,
    WelcomeComponent,
    TaskComponent,
    AddcollabComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    DragDropModule,
    MatExpansionModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,

  
  ],
  providers: [TaskaddService,AddcollaboratorService,DatePipe, CommentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
