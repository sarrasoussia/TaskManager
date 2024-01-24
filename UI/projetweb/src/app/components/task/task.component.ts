import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from './Task';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// import { CommentService } from 'src/app/services/comment.service';
// import { Comment } from './Comment' 

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: Task = new Task(0, '', '', new Date(), 'pending', null, '');
  tasks: Task[] = [];

  // comments: Comment[] = [];
  // newCommentText: string = '';
  selectedTaskId: number;

  userDetails: { username: string } | null = null;

  constructor(
    private taskService: TaskService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    // private commentService: CommentService
  ) {}

  private loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnInit(): void {

    this.loadTasks();

    this.route.paramMap.subscribe(params => {
      this.selectedTaskId = +params.get('taskId');
    });

     // this.fetchComments(this.selectedTaskId);

      this.taskService.getActiveUserDetails().subscribe(
        (data) => {
          this.userDetails = data;
        }
      );
    
  }

  addTask(): void {
    const taskId = this.tasks.length + 1;
    const newTask = new Task(
      taskId,
      this.task.name,
      this.task.description,
      this.task.deadline,
      this.task.state,
      this.task.file,
      this.task.username_task,
    );
    this.taskService.addTask(newTask).subscribe(() => {
      this.task = new Task(0,'', '', new Date(), 'pending', null,'');
      this.loadTasks();
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

  // onFileSelected(event: any): void {
  //   const fileInput = event.target;
  //   if (fileInput.files.length > 0) {
  //     this.task.file = fileInput.files[0].name;
  //   }
  // }

  editTask(index: number): void {
    this.tasks[index].editMode = true;
  }

  saveTask(task: any, index: number): void {
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks();
    });
    this.tasks[index] = { ...task, editMode: false };
  }

  cancelEdit(task: any, index: number): void {
    this.tasks[index] = { ...task, editMode: false };
  }

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

  // Comment section
  // fetchComments(taskId: number): void {
  //   this.commentService.getCommentsByTaskId(taskId).subscribe(
  //     (data: Comment[]) => {
  //       this.comments = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching comments:', error);
  //     }
  //   );
  // }

  // addComment(taskId: number): void {
  //   if (this.newCommentText.trim() !== '') {
  //     const currentUsername = this.commentService.getCurrentUsername();

  //     if (currentUsername) {
  //       const newComment: Comment = {
  //         id: 0,
  //         content: this.newCommentText,
  //         created_at: new Date(),
  //         owner: currentUsername
  //       };

  //       this.commentService.addComment(newComment).subscribe(
  //         (response: any) => {
  //           this.fetchComments(taskId);
  //         },
  //         (error) => {
  //           console.error('Error adding comment:', error);
  //         }
  //       );

  //       // Clear the input field
  //       this.newCommentText = '';
  //     } else {
  //       console.error('Unable to determine the current username.');
  //     }
  //   }
  // }
}
