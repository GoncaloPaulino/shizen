import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { Router } from '@angular/router';
import { AppVarsService } from 'src/app/services/app-vars.service';
import { PlantService } from 'src/app/services/plant.service';

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

  userfavs = [];

  constructor(
    private router: Router,
    private vars: AppVarsService,
    private plantsServ: PlantService
    ) { 
    }

  ngOnInit() {
    this.userfavs = this.plantsServ.getUserFavs();
    console.log(JSON.stringify(this.userfavs));
  }

  async openPlantInfo(id: number){
    await this.plantsServ.getPlantsDb();
    this.vars.setSelPlant(id);
    this.router.navigateByUrl('/plant');
  }

  async toggleFav(id: number){
    await this.plantsServ.toggleFavourite(id);
    if(this.userfavs.includes(id, 0))
      this.userfavs.splice(this.userfavs.indexOf(id, 0), 1);
    else
      this.userfavs.push(id);
  }

}
