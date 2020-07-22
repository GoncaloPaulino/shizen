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

  //Lista de flores precarregada para reduzir o tempo de espera na primeira inicialização
  plants = [
    {
      id: 1,
      name: "Rosa"
    },
    {
      id: 2,
      name: "Tulipa"
    },
    {
      id: 3,
      name: "Girassol"
    },
    {
      id: 4,
      name: "Margarida"
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

  //Abrir a pagina de uma planta especifica
  async openPlantInfo(id: number){
    await this.plantsServ.getPlantsDb();
    this.vars.setSelPlant(id);
    this.router.navigateByUrl('/plant');
  }

  //Mudar o estado de favorito (favoritar/desfavoritar)
  async toggleFav(id: number){
    await this.plantsServ.toggleFavourite(id);
    if(this.userfavs.includes(id, 0))
      this.userfavs.splice(this.userfavs.indexOf(id, 0), 1);
    else
      this.userfavs.push(id);
  }

}
