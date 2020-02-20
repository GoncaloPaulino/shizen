import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

const SP_KEY = 'selected-plant';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  
  public sel_plant: number;

  constructor(private storage: Storage, private plt: Platform, private router: Router) { 
      this.loadStoredSelPlant();
     }

  loadStoredSelPlant(){
    let platObs = from(this.plt.ready());
    platObs.pipe(
      switchMap(() =>{
        return from(this.storage.get(SP_KEY));
      }),
      map(sp => {
        if(sp){
          this.sel_plant = Number(sp);
        }else{
          this.sel_plant = null;
        }
      })
    );
  }

  setSelPlant(id: number) {
    this.sel_plant=id;
    this.storage.set(SP_KEY, id);
  }

  getSelPlant(){
    return this.sel_plant;
  }

}
