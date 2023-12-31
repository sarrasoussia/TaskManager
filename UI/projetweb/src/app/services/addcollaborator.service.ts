import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddcollaboratorService {
  private users:{nom:string,prenom:string,tel:number,email:string}[]=[
    {nom:"soussia",prenom:"sarra",tel:12345678,email:"bhiriala577@gmail.com"},
    {nom:"bhiri",prenom:"ala",tel:789456612,email:"lakkdn@gmail.com"}
  ]
  getAllcollaboraters():{nom:string,prenom:string,tel:number,email:string}[]{
    return this.users;
  }
  addCollaborator(name:string,fname:string,phone:number,mail:string){
    const item = { nom: name, prenom: fname, tel: phone,email: mail};
    this.users.push(item);
  }

  constructor() { }
}
