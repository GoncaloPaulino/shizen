import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = {
    email: 'manuoliva@sapo.pt',
    pw: 'test'
  };
 
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {
  }

  async login() {
    if(this.credentials.email=="" || this.credentials.pw==""){
      this.showAlert("Por favor preencha todos os campos.");
      return;
    }
    let loading = await this.loadCtrl.create();
    await loading.present();
    this.auth.login(this.credentials).subscribe(async res => {
      loading.dismiss();
      if(res==null) return;
      if (res.localeCompare("AUTH_ERROR")!=0) {
        this.router.navigateByUrl('/menu');
      } else {
        this.showAlert("Credenciais inválidos.")
      }
    });
  }

  gotoregister() {
    this.router.navigateByUrl('/register');
  }

  async showAlert(msg: string){
    const alert = await this.alertCtrl.create({
      header: 'Falha no Login',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

}
