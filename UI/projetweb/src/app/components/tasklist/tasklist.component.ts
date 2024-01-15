import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskaddService } from 'src/app/services/taskadd.service';


@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css'],
})
export class TasklistComponent implements OnInit {
  newDoneTaskname:string="";
  newDoneTaskdescrip:string="";
  newDoneTaskowner:string="";
  newDoneDate:Date|undefined;
  newtodoTaskname:string="";
  newtodoTaskdescrip:string="";
  newtodoTaskowner:string="";
  newtodoDate:Date|undefined;
  newinprogressTaskname:string="";
  newinprogressTaskdescrip:string="";
  newinprogressTaskowner:string="";
  newinprogressDate:Date|undefined;

  
  todo: {id: number,etat: string,titre: string, description: string ,proprietaire: string,date_fin: Date }[]=[] ;
  done: { id: number,etat: string,titre: string, description: string ,proprietaire: string,date_fin: Date}[]=[];
  inprogress: { id: number,etat: string,titre: string, description: string ,proprietaire: string,date_fin: Date}[]=[];
  alltasks: { id: number,etat: string,titre: string, description: string ,proprietaire: string,date_fin: Date}[]=[];
  constructor(private taskAddService:TaskaddService) { 
    
  }
 
  adddDoneTasks(): void {
    if (this.newDoneTaskname.trim()!=="" && this.newDoneTaskdescrip.trim()!=="" && this.newDoneTaskowner.trim()!=="") {
      this.taskAddService.addTask({
        etat: "done",
        titre: this.newDoneTaskname,
        description: this.newDoneTaskdescrip,
        proprietaire: this.newDoneTaskowner,
        date_fin: this.newDoneDate
      }).subscribe(res => {
        console.log(res);
      });
      this.newDoneDate=undefined;
      this.newDoneTaskname = "";
      this.newDoneTaskdescrip = "";
      this.newDoneTaskowner = "";
      
    }
  }
  
  adddInprogressTasks():void{
    if (this.newinprogressTaskname.trim() !== "" && this.newinprogressTaskdescrip.trim() !== "" && this.newinprogressTaskowner.trim() !== "") {
      this.taskAddService.addTask({
        etat: "in progress",
        titre: this.newinprogressTaskname,
        description: this.newinprogressTaskdescrip,
        proprietaire: this.newinprogressTaskowner,
        date_fin: this.newinprogressDate
      }).subscribe(res => {
        console.log(res);
      });
      this.newinprogressDate=undefined;
      this.newinprogressTaskname = "";
      this.newinprogressTaskdescrip = "";
      this.newinprogressTaskowner = "";
    }
  }
  adddToDoTasks():void{
    if (this.newtodoTaskname.trim() !== "" && this.newtodoTaskdescrip.trim() !== "" && this.newtodoTaskowner.trim() !== "") {
      this.taskAddService.addTask({
        etat: "to do",
        titre: this.newtodoTaskname,
        description: this.newtodoTaskdescrip,
        proprietaire: this.newtodoTaskowner,
        date_fin: this.newtodoDate
      }).subscribe(res => {
        console.log(res);
      });
      this.newtodoDate=undefined;
      this.newtodoTaskname = "";
      this.newtodoTaskdescrip = "";
      this.newtodoTaskowner = "";
    }
  }
  ngOnInit(): void {
    this.taskAddService.getAllTasks().subscribe(res => {
      this.alltasks = res;
      for (let task of this.alltasks) {
        if (task.etat === 'done') {
          this.done.push(task)
        }
        if (task.etat === 'to do') {
          this.todo.push(task)
        }
        if (task.etat === 'in progress') {
          this.inprogress.push(task)
        }
      }});
    
  }
 

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  lists = [
    {ala:this.todo,nom:"ToDo"},
    {ala:this.inprogress,nom:"In Progress"},
    {ala:this.done,nom:"Done"},
  ]

 
}



 // adddToDoTasks():void{
  //   if(this.newtodotitre.trim()!==""&&this.newtodoTaskdescrip.trim()!==""&&this.newtodoTaskproprietaire.trim()!==""){
  //     this.taskAddService.addtodoTasks(this.newtodotitre,this.newtodoTaskproprietaire,this.newtodoTaskdescrip);
  //     this.todo=this.taskAddService.getAlltodotasks();
  //     this.newtodotitre="";
  //     this.newtodoTaskdescrip="";
  //     this.newtodoTaskproprietaire="";
  //     console.log("todoaddsucc");
  //   }
  // }
 
  // adddInprogressTasks():void{
  //   if(this.newinprogresstitre.trim()!==""&&this.newinprogressTaskdescrip.trim()!==""&&this.newinprogressTaskproprietaire.trim()!==""){
  //     this.taskAddService.addtodoTasks(this.newinprogresstitre,this.newinprogressTaskproprietaire,this.newinprogressTaskdescrip);
  //     this.todo=this.taskAddService.getAllinprogresstasks();
  //     this.newinprogresstitre="";
  //     this.newinprogressTaskdescrip="";
  //     this.newinprogressTaskproprietaire="";
  //     console.log("todoaddsucc");
  //   }
  // }