export class Task {
  id: number;
  name: string;
  description: string;
  deadline: Date;
  state: string;
  file: File | null;
  username_task: string;
  editMode: boolean;
 
  constructor(
    id: number,
    name: string,
    description: string,
    deadline: Date,
    state: string,
    file: File | null,
    username_task: string,
    ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.state = state;
    this.file = file;
    this.username_task = username_task;

  }
}
