import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from './Task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: Task = new Task(0, '', '', new Date(), '', 'pending', null);
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }


// partie tasks w ka jaw

  addTask(): void {
    const taskId = this.tasks.length + 1;
    const newTask = new Task(
      taskId,
      // this.task.username,
      this.task.name,
      this.task.description,
      this.task.deadline,
      this.task.owner,
      this.task.state,
      this.task.file
    );
    this.taskService.addTask(newTask).subscribe(() => {
      this.loadTasks();
      this.task = new Task(0,'', '', new Date(), '', 'pending', null);
    });
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  removeTask(taskId: number): void {
    console.log('Removing task with ID:', taskId);
    this.taskService.removeTask(taskId).subscribe(
      () => {
        console.log('Task removed successfully.');
        this.loadTasks();
      },
      (error) => {
        console.error('Error removing task:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      this.task.file = fileInput.files[0].name;
    }
  }

  // Start editing a task
  editTask(task: Task): void {
    task.editing = true;
  }

  // Save the edited task
  saveTask(task: Task): void {
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks();
      task.editing = false; 
    });
  }

  // Cancel editing and discard changes
  cancelEdit(task: Task): void {
    task.editing = false; // Stop editing
  }

  // Add a method to calculate the difference in days
  calculateDaysDifference(deadline: Date): number {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const differenceInTime = deadlineDate.getTime() - currentDate.getTime();
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  }

  getTaskColorClass(deadline: Date): string {
    const daysDifference = this.calculateDaysDifference(deadline);

    if (daysDifference < 7) {
      return 'red-task';
    } else if (daysDifference >= 7 && daysDifference <= 14) {
      return 'yellow-task';
    } else {
      return 'green-task';
    }
  }




}


