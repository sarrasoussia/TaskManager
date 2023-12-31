import { Component, OnInit } from '@angular/core';
import { AddcollaboratorService } from 'src/app/services/addcollaborator.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users :{nom:string,prenom:string,tel:number,email:string}[]=this.AddcollaboratorService.getAllcollaboraters();
  
  newUserName:string="";
  newUserFname:string="";
  newUserphone:number|undefined;
  newUserEmail:string="";
  addcollaborator():void{
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phonePattern = /^\d{8}$/;
    if(this.newUserName.trim()!==""&&this.newUserFname.trim()!==""&&this.newUserEmail.trim()!==""&&emailPattern.test(this.newUserEmail)&&this.newUserphone !== undefined && phonePattern.test(this.newUserphone.toString()) ){
      this.AddcollaboratorService.addCollaborator(this.newUserName,this.newUserFname,this.newUserphone,this.newUserEmail);
      this.users=this.AddcollaboratorService.getAllcollaboraters();
      this.newUserEmail="";
      this.newUserName="";
      this.newUserFname="";
      this.newUserphone=undefined;
    }

  }
  constructor(private AddcollaboratorService:AddcollaboratorService) { }

  ngOnInit() {
  }

}
