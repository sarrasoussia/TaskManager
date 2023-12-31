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
  newtodoTaskname:string="";
  newinprogressTaskname:string="";
  newDoneTaskdescrip:string="";
  newtodoTaskdescrip:string="";
  newinprogressTaskdescrip:string="";
  newDoneTaskowner:string="";
  newtodoTaskowner:string="";
  newinprogressTaskowner:string="";
  
  todo: { taskname: string, owner: string, description: string }[]=this.taskAddService.getAlltodotasks() ;
  done: { taskname: string, owner: string, description: string }[]=this.taskAddService.getAlldonetasks();
  inprogress: { taskname: string, owner: string, description: string }[]=this.taskAddService.getAllinprogresstasks();
  constructor(private taskAddService:TaskaddService) { 
    
  }
  adddToDoTasks():void{
    if(this.newtodoTaskname.trim()!==""&&this.newtodoTaskdescrip.trim()!==""&&this.newtodoTaskowner.trim()!==""){
      this.taskAddService.addtodoTasks(this.newtodoTaskname,this.newtodoTaskowner,this.newtodoTaskdescrip);
      this.todo=this.taskAddService.getAlltodotasks();
      this.newtodoTaskname="";
      this.newtodoTaskdescrip="";
      this.newtodoTaskowner="";
      console.log("todoaddsucc");
    }
  }
  adddDoneTasks():void{
    if(this.newDoneTaskname.trim()!==""&&this.newDoneTaskdescrip.trim()!==""&&this.newDoneTaskowner.trim()!==""){
      this.taskAddService.addtodoTasks(this.newDoneTaskname,this.newDoneTaskowner,this.newDoneTaskdescrip);
      this.todo=this.taskAddService.getAlldonetasks();
      this.newDoneTaskname="";
      this.newDoneTaskdescrip="";
      this.newDoneTaskowner="";
      console.log("todoaddsucc");
    }
  }
  adddInprogressTasks():void{
    if(this.newinprogressTaskname.trim()!==""&&this.newinprogressTaskdescrip.trim()!==""&&this.newinprogressTaskowner.trim()!==""){
      this.taskAddService.addtodoTasks(this.newinprogressTaskname,this.newinprogressTaskowner,this.newinprogressTaskdescrip);
      this.todo=this.taskAddService.getAllinprogresstasks();
      this.newinprogressTaskname="";
      this.newinprogressTaskdescrip="";
      this.newinprogressTaskowner="";
      console.log("todoaddsucc");
    }
  }
  // handleButtonClick(list: any): void {
  //   if (list.nom === "ToDo") {
  //     this.adddToDoTasks();
  //   } else if (list.nom === "In Progress") {
  //     this.adddInprogressTasks();
  //   } else {
  //     this.adddDoneTasks();
  //   }
  // }
  
  ngOnInit() {
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
