import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { AppVarsService } from 'src/app/services/app-vars.service';
import { Plant, PlantService } from 'src/app/services/plant.service';
import { AlertController } from '@ionic/angular';

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
    private alertCtrl: AlertController,
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

  moreInfo(){
    this.showAlert("Para mais informação aceda ao seguinte link: https://jb.utad.pt");
  }

  async showAlert(msg: string){
    const alert = await this.alertCtrl.create({
      header: 'Mais Informação',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

}
