import { Injectable } from '@angular/core';
import { switchMap, map, catchError, take } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { API } from 'src/const';
import { HTTP } from '@ionic-native/http/ngx';

export interface Plant {
  id: number;
  common_name: string;
  scientific_name: string;
  label_name: string;
  description: string;
}

const PLANTS_KEY = 'plants-data';
const LAST_UPDATE = 'plants-data-last-update';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  
  private plants: Plant[];
  private last_update: number;
  
  constructor(private storage: Storage, private plt: Platform, private router: Router, private http: HTTP, private alertCtrl: AlertController, private loadCtrl: LoadingController, private toastCtrl : ToastController) { 
    this.loadStoredData();
  }

  async loadStoredData(){
    let platObs = from(this.plt.ready());
    await platObs.pipe(
      switchMap(() =>{ return from(this.storage.get(LAST_UPDATE)); }),
      map(lu => { if(lu) this.last_update = lu; else this.last_update = -1;})
    );
    await platObs.pipe(
      switchMap(() =>{ return from(this.storage.get(PLANTS_KEY)); }),
      map(plts => { if(plts) this.plants = plts; else this.plants = null;})
    );
  }

  async getPlantsDb(){
    console.log("uyty");
    console.log(String(this.last_update));
    if(this.last_update < 1000 || this.last_update==undefined){
      console.log("saf");
      let first = this.last_update==-1;
      let load = await this.loadCtrl.create({
        spinner: "dots",
        message: (first ? "Obtendo a lista de plantas.." : "Atualizando a lista de plantas...")
      });
      load.present();
      console.log("hghrth");
      this.updatePlants(first, load);
    }
  }

  updatePlants(first: boolean, load:any){
    console.log("j76");
    this.http.setDataSerializer( "utf8" );
    console.log("k876eg");
    let call = this.http.get(API + "plants", {}, {});
    console.log("i87i");
    from(call).pipe(
      take(1),
      map(res => {
        return res;
      }),
      switchMap(res => {
        let plants : Plant[] = [];
        console.log("ty54y");
        for (var i of JSON.parse(String(res))) {
          
          console.log("vv");
          let plnt : Plant = {
            id: i.idx,
            common_name: i.common_name,
            scientific_name: i.scientific_name,
            label_name: i.label_name,
            description: i.description
          };
          plants.push(plnt);
        }
        console.log("fa4");
        return of<Plant[]>(plants);
      }),
      catchError(error => this.handleError(error, first))
    ).subscribe((plants : Plant[]) =>{
      this.plants = plants;
      load.dismiss();
      console.log("f4");
    });
  }
  
  private async handleError(error: any, first: boolean){
    if(first){
      const alert = await this.alertCtrl.create({
        header: "Erro",
        message: "Não foi possível obter uma lista de plantas!",
        buttons: [{
          text: 'Fechar',
          role: 'cancel',
          handler: () => {
            navigator['app'].exitApp();
          }
        }]
      });
      await alert.present();
    }else{
      const toast = await this.toastCtrl.create({
        message: 'Não foi possível atualizar a lista de plantas.' + error.message,
        duration: 4000,
        position: 'bottom'
      });
    
      toast.present();
    }
  }

  getPlants() : Plant[] {
    return this.plants;
  }

}
