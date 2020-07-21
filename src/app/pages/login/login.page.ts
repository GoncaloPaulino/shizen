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
        this.showAlert("Credenciais inválidos.");
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

  async recoError(msg: string){
    const alert = await this.alertCtrl.create({
      header: 'Erro',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async recPassAlert(msg: string){
    const alert = await this.alertCtrl.create({
      header: 'Recuperar Password',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async recoverPassword(){
    const alert = await this.alertCtrl.create({
      header: 'Recuperar Password',
      message: 'Insira o seu e-mail para lhe enviarmos um e-mail com a sua nova palavra-passe.',
      inputs: [
        {
          name: 'email',
          placeholder: 'E-mail'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async data => {
            let em = data.email;
            if(em==""){
              await this.recoError("Por favor insira o seu E-mail.");
            }else{
              alert.dismiss();

              var regemail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

              if(!regemail.test(em)){
                await this.recoError("O E-mail fornecido é inválido!");
                return;
              }

              this.auth.recoverPassword(em).subscribe(res => {
                if (res) {
                  if(res==0){
                    this.recoError("Erro desconhecido! Por favor tente novamente.");
                  }else if(res==1){
                    this.recPassAlert("Caso exista uma conta com esse endereço de E-mail, enviaremos-lhe a sua nova password.")
                  }
                } else {
                  this.recoError("Erro desconhecido! Por favor tente novamente.");
                }
                return;
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
