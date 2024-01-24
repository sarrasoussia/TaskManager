export class Comment {
    id: number;
    content: string;
    created_at: Date; 
    owner: string; 
  
    constructor(id: number, content: string, created_at: Date, owner: string) {
      this.id = id;
      this.content = content;
      this.created_at = created_at;
      this.owner = owner;
    }
  }
  