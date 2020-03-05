import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  user = null;
 
  constructor(private auth: AuthService,
    private alertCtrl: AlertController) {
    this.user = this.auth.getUser();
  }
 
  logout() {
    this.auth.logout();
  }

  changename(){
    this.showAlert("Manutenção", "Função temporariamente indisponível!");
  }

  changemail(){
    this.showAlert("Manutenção", "Função temporariamente indisponível!");
  }

  changepass(){
    this.showAlert("Manutenção", "Função temporariamente indisponível!");
  }

  async showAlert(hdr: string, msg: string){
    let alert = await this.alertCtrl.create({
      header: hdr,
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

}
