import { Component, OnInit } from '@angular/core';
import { PlantService } from 'src/app/services/plant.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'

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
    private plnts: PlantService,
    private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url =>{
      let selid = this.plnts.getSelPlant();
      if(selid==null){
        this.router.navigateByUrl('/list');
      }else{
        this.plant.id = selid;
      }
    });
  }

}
