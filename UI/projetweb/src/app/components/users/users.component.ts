import { Component, OnInit } from '@angular/core';
import { AddcollaboratorService } from 'src/app/services/addcollaborator.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  passwordd:string="";
  password:string="";
  newCollabUsername:string="";
  users :string[]=[];
  userss :string;
  constructor(private AddcollaboratorService:AddcollaboratorService) { }
  addCollab(){
    this.AddcollaboratorService.addCollab(this.passwordd,this.newCollabUsername).subscribe(res=>{
      console.log(res);
      this.showcollabs();     
    }
    )
    this.passwordd="";
    this.newCollabUsername="";   
  }
  showcollabs(){
    this.AddcollaboratorService.getcollabs(this.password).subscribe(res=>{
      this.userss=res[0].collaborators;
      this.users=this.userss.split(',').filter(element => element !== '');
    })

  }
  ngOnInit() {
    this.AddcollaboratorService.getcollabs(this.password).subscribe(res=>{
      this.userss=res[0].collaborators;
      this.users=this.userss.split(',').filter(element => element !== '');
    })
   
  }

}
