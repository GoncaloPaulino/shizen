import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  plants = [
    {
      id: 1,
      name: "Carvalho"
    },
    {
      id: 2,
      name: "Sobreiro"
    }
  ];

  userfavs = [1];

  constructor() { }

  ngOnInit() {
  }

  toggleFav(id: number){
    let index: number = this.userfavs.indexOf(id);
    if(index===-1)
      this.userfavs.push(id);
    else
      this.userfavs.splice(index, 1);
  }

}
