import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credentials = {
    name: '',
    email: '',
    pw: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  register() {
    if(this.credentials.email=="" || this.credentials.pw=="" || this.credentials.name ==""){
      this.showAlert("Por favor preencha todos os campos.");
      return;
    }
    this.auth.register(this.credentials).subscribe(async res => {
      if (res) {
        this.router.navigateByUrl('/login');
      } else {
        this.showAlert("Erro desconhecido! Por favor tente novamente.");
      }
    });
  }

  async showAlert(msg: string){
    const alert = await this.alertCtrl.create({
      header: 'Falha no Registro',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

}
