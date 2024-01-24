import { Component, OnInit } from '@angular/core';
import { AddcollaboratorService } from 'src/app/services/addcollaborator.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userDetails: { username: string } | null = null;
  passwordd:string="";
  password:string="";
  newCollabUsername:string="";
  users :string[]=[];
  userss :string;
  constructor(private AddcollaboratorService:AddcollaboratorService) { }
  addCollab(){
    this.AddcollaboratorService.addCollab(this.newCollabUsername).subscribe(res=>{
      console.log(res);
      this.AddcollaboratorService.getActiveUserDetails().subscribe(
        (data) => {
          this.userDetails = data;
          this.AddcollaboratorService.getcollabs(this.userDetails.username).subscribe(res=>{
            this.userss=res[0].collaborators;
            this.users=this.userss.split(',').filter(element => element !== '');
          })
        }      
      );
    }
    )
    this.newCollabUsername="";   
  }
  deleteCollab(){
    this.AddcollaboratorService.deleteCollab(this.newCollabUsername).subscribe(res=>{
      console.log(res);    
    }
    )
    this.newCollabUsername="";   
  }
  ngOnInit() {
    this.AddcollaboratorService.getActiveUserDetails().subscribe(
      (data) => {
        this.userDetails = data;
        this.AddcollaboratorService.getcollabs(this.userDetails.username).subscribe(res=>{
          this.userss=res[0].collaborators;
          this.users=this.userss.split(',').filter(element => element !== '');
        })
      }      
    );
   
  }

}