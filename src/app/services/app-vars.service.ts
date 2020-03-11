import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppVarsService {

  private sel_plant: number;

  constructor() { 
  }
  
  setSelPlant(id: number) { this.sel_plant=id; }

  getSelPlant(){ return this.sel_plant; }
}
