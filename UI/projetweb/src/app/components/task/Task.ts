export class Task {
  id: number;
  // username: string;
  name: string;
  description: string;
  deadline: Date;
  owner: string;
  state: string;
  file: File | null;
  editing?: boolean; 
  // collaborators: string[]; 
 
  constructor(
    id: number,
    // username: string,
    name: string,
    description: string,
    deadline: Date,
    owner: string,
    state: string,
    file: File | null,
    // collaborators: string[] = [],
    editing?: boolean,

  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.owner = owner;
    this.state = state;
    this.file = file;
    // this.collaborators = collaborators;
    this.editing = editing;
    // this.username= username;
  }
}
