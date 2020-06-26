import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { AppVarsService } from 'src/app/services/app-vars.service';
import { Plant, PlantService } from 'src/app/services/plant.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
})
export class PlantPage implements OnInit {

  plant: Plant[];

  constructor(
    private router: Router,
    private vars: AppVarsService,
    private activatedRoute : ActivatedRoute,
    private plantsServ: PlantService) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url =>{
      let selid = this.vars.getSelPlant();
      if(selid==null){
        this.router.navigateByUrl('/list');
      }else{
        this.plant = this.plantsServ.getPlants()[selid];
      }
    });
  }

}
