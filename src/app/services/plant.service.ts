import { Injectable } from '@angular/core';
import { switchMap, map, catchError, take, timeout } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { API } from 'src/const';
import { HTTP } from '@ionic-native/http/ngx';
import { DecimalPipe } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface Plant {
  id: number;
  common_name: string;
  scientific_name: string;
  label_name: string;
  description: string;
  min_height: number;
  max_height: number;
  native: string;
  classifiable: number;
  more_info: string;
}

const helper = new JwtHelperService();
const PLANTS_KEY = 'plants-data';
const LAST_UPDATE = 'plants-data-last-update';
const TOKEN_KEY = 'jwt-token';
const USER_FAVS_KEY = 'user-fav';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  
  private plants: {};
  private last_update: number;
  private user_favs: number[];
  
  constructor(private storage: Storage, private plt: Platform, private router: Router, private http: HTTP, private alertCtrl: AlertController, private loadCtrl: LoadingController, private toastCtrl : ToastController) { 
    this.loadStoredData();
    this.http.setDataSerializer( "utf8" );
  }

  loadStoredData(){
    this.storage.get(LAST_UPDATE).then(lu => { if(lu) this.last_update = lu; else this.last_update = -1; });
    this.storage.get(PLANTS_KEY).then(plts => { if(plts) this.plants = plts; else this.plants = null; });
    this.storage.get(USER_FAVS_KEY).then(uf => { 
      if(uf) 
        this.user_favs = uf;
      else{
        this.user_favs = null; 
        this.getUserFavsFromDB();
      }
    });
  }

  async getPlantsDb(){
    console.log("Last update: " + String(this.last_update));
    if((new Date().getTime() - this.last_update) > 24*60*60*1000 || this.last_update==undefined || this.last_update==-1){
      console.log("[INFO] Updating flower list...");
      let first = this.last_update==-1 || this.last_update==undefined;
      let load = await this.loadCtrl.create({
        spinner: "dots",
        message: (first ? "Obtendo a lista de flores.." : "Atualizando a lista de flores...")
      });
      load.present();
      await this.updatePlants(first, load);
      this.storage.set(PLANTS_KEY, this.plants);
      this.storage.set(LAST_UPDATE, new Date().getTime());
    }
  }

  async updatePlants(first: boolean, load:any){
    let call = this.http.get(API + "flowers", {}, {});
    await from(call).pipe(
      timeout(10000),
      take(1),
      map(res => {
        return res;
      }),
      switchMap(res => {
        let plants : { [id: number]: Plant; } = {};
        for (var i of JSON.parse(res.data)) {
          
          let plnt : Plant = {
            id: i.idx,
            common_name: i.common_name,
            scientific_name: i.scientific_name,
            label_name: i.label_name,
            description: i.description,
            min_height: i.min_height,
            max_height: i.max_height,
            native: i.native,
            classifiable: i.classifiable,
            more_info: i.more_info
          };
          plants[i.idx] = plnt;
        }
        return of<{ [id: number]: Plant; }>(plants);
      }),
      catchError(error => this.handleError(error, first))
    ).toPromise().then((plants : { [id: number]: Plant; }) =>{
      this.plants = plants;
      console.log("[INFO] Retrieved flowers from database.");
      load.dismiss();
    });
  }
  
  private async handleError(error: any, first: boolean){
    if(first){
      const alert = await this.alertCtrl.create({
        header: "Erro",
        message: "Não foi possível obter uma lista de flores!",
        buttons: [{
          text: 'Fechar Aplicação',
          role: 'cancel',
          handler: () => {
            navigator['app'].exitApp();
          }
        }]
      });
      await alert.present();
    }else{
      const toast = await this.toastCtrl.create({
        message: 'Não foi possível atualizar a lista de flores.',
        duration: 4000,
        position: 'bottom'
      });
    
      toast.present();
    }
  }

  getPlants() : {} {
    return this.plants;
  }

  getLastUpdate() : number {
    return this.last_update;
  }

  private async handleErrorFavs(error: any){
    const toast = await this.toastCtrl.create({
      message: 'Não foi possível obter a lista de favoritos.',
      duration: 4000,
      position: 'bottom'
    });
  
    toast.present();
  }

  private async handleErrorFavsT(error: any){
    const toast = await this.toastCtrl.create({
      message: 'Não foi possível alterar o estado de favorito dessa flor.',
      duration: 4000,
      position: 'bottom'
    });
  
    toast.present();
  }

  async getUserFavsFromDB(){
    if(this.user_favs==null){
      this.storage.get(TOKEN_KEY).then(async tk => {
        let id = helper.decodeToken(tk).id
        let call = this.http.get(API + "fav/" + id, {}, {});
        await from(call).pipe(
          timeout(10000),
          take(1),
          map(res => {
            return res;
          }),
          switchMap(res => {
            let favs = JSON.parse(res.data)
            return of<number[]>(favs);
          }),
          catchError(error => this.handleErrorFavs(error))
        ).toPromise().then((favs : number[]) =>{
          this.user_favs = favs;
          console.log("[INFO] Retrieved favorites from database.");
        });
      });
    }
    this.storage.set(USER_FAVS_KEY, this.user_favs);
  }

  getUserFavs() : number[] {
    if(this.user_favs==null){
      return [];
    }
    return this.user_favs;
  }

  async toggleFavourite(flower: number){
    this.storage.get(TOKEN_KEY).then(async tk => {
      let id = helper.decodeToken(tk).id
      let call = this.http.get(API + "fav/" + id + "/" + flower, {}, {});
      await from(call).pipe(
        timeout(10000),
        take(1),
        map(res => {
          return res;
        }),
        switchMap(res => {
          return of<number>(res.data);
        }),
        catchError(error => this.handleErrorFavsT(error))
      ).toPromise().then((state : number) =>{
        switch(state){
          case 1:
            if(!this.user_favs.includes(flower, 0))
              this.user_favs.push(flower);
            console.log("[FAV] Flower " + flower + " was added to user's favs.");
            break;
          case 0:
            if(this.user_favs.includes(flower, 0))
              this.user_favs.splice(this.user_favs.indexOf(flower, 0), 1);
            console.log("[FAV] Flower " + flower + " was removed from user's favs.");
            break;
          case 2:
            console.log("[FAV] Error while toggling flower " + flower + " on user's favs.");
            break;
        }
      });
    });
    this.storage.set(USER_FAVS_KEY, this.user_favs);
  }

}
