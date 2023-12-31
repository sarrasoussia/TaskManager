import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskaddService {
  private donetasks: { taskname: string, owner: string, description: string }[] = [
   
  ];
  private inprogresstasks: { taskname: string, owner: string, description: string }[] = [
   
  ];
  private todotasks: { taskname: string, owner: string, description: string }[] = [
   
  ];
  
  addDoneTasks(taskn:string,own:string,descrip:string):void{
    const item = { taskname: taskn, owner: own, description: descrip };
    this.donetasks.push(item);
  }
  addtodoTasks(taskn:string,own:string,descrip:string):void{
    const item = { taskname: taskn, owner: own, description: descrip };
    this.todotasks.push(item);
  }
  addinprogressTasks(taskn:string,own:string,descrip:string):void{
    const item = { taskname: taskn, owner: own, description: descrip };
    this.inprogresstasks.push(item);
  }
  getAlldonetasks():{ taskname: string, owner: string, description: string }[]{
    return this.donetasks;
  }
  getAllinprogresstasks():{ taskname: string, owner: string, description: string }[]{
    return this.inprogresstasks;
  }
  getAlltodotasks():{ taskname: string, owner: string, description: string }[]{
    return this.todotasks;
  }
  constructor() { }
}
