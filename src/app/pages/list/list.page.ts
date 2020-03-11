import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { Router } from '@angular/router';
import { AppVarsService } from 'src/app/services/app-vars.service';

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
      name: "Platano"
    },
    {
      id: 3,
      name: "Sobreiro"
    }
  ];

  userfavs = [1];

  constructor(
    private router: Router,
    private vars: AppVarsService
    ) { }

  ngOnInit() {
  }

  openPlantInfo(id: number){
    this.vars.setSelPlant(id);
    this.router.navigateByUrl('/plant');
  }

  toggleFav(id: number){
    let index: number = this.userfavs.indexOf(id);
    if(index===-1)
      this.userfavs.push(id);
    else
      this.userfavs.splice(index, 1);
  }

}
