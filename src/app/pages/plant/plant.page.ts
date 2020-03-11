import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { AppVarsService } from 'src/app/services/app-vars.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
})
export class PlantPage implements OnInit {

  plant = {
    id: 1,
    common_name: "Carvalho",
    scientific_name: "Quercus coccifera",
    label_name: "carvalho",
    description: "Carvalho é a designação comum das cerca de seiscentas espécies de árvores do género Quercus da família Fagaceae e de outros géneros relacionados, nomeadamente Lithocarpus."
  }

  constructor(
    private router: Router,
    private vars: AppVarsService,
    private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url =>{
      let selid = this.vars.getSelPlant();
      if(selid==null){
        this.router.navigateByUrl('/list');
      }else{
        this.plant.id = selid;
      }
    });
  }

}
