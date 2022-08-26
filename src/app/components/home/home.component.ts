import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home', 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(
    private todoService:TodoService,
    private _snackBar: MatSnackBar
    
  ) { }

  ngOnInit(): void {
 
    this.getAllTodos();
  }

  data:any = {};

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      // Object.keys(this.data).forEach((key) => {
      //   localStorage.setItem(key, JSON.stringify(this.data[key]));
      // });
    }
    this.updateTodo();
  }

  /*addTodo(eklenecek:any){
    this.data.todo.push(eklenecek.value);
    localStorage.setItem('todo', JSON.stringify(this.data.todo));
    eklenecek.value='';
  }

  setItems(){
    Object.keys(this.data).forEach((key) => {
      if (!localStorage.getItem(key)){
        localStorage.setItem(key, JSON.stringify(this.data[key]));
      }else{
        this.data[key] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    });
  }*/

  addTodo(todo:any){
    const obj = {todo: todo.value};
    this.todoService.addTodo(obj)
    .subscribe((res:any)=>{
      this.openSnackBar(res.message);
      console.log(res);
      this.getAllTodos();
      todo.value='';
    },(err)=>{
      console.log(err);
    });
  }

  getAllTodos(){
    this.todoService.getAllTodos()
      .subscribe((res:any)=>{
        Object.keys(res).forEach((key)=>{
          this.data[key]=res[key];
        })
      }, (err)=>{
        console.log(err);
      });
  }

  updateTodo(){
    this.todoService.updateTodo(this.data)
      .subscribe((res)=>{
        console.log(res);
        this.getAllTodos();
      },(err)=>{
        console.log(err);
      })
  }

  removeTodo(id:any){
    if(confirm('Are you sure you want to delete this item? ')){
      this.todoService.removeTodo(id)
      .subscribe((res)=>{
        console.log(res);
        this.getAllTodos();
      },(err)=>{
        console.log(err);
      });
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'tamam');
  }

}
