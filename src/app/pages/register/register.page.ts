import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

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
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  register() {
    if(this.credentials.email=="" || this.credentials.pw=="" || this.credentials.name ==""){
      this.showAlert("Por favor preencha todos os campos.");
      return;
    }

    var regemail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var regpw = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);

    if(!regemail.test(this.credentials.email)){
      this.showAlert("O email fornecido é inválido!");
      return;
    }

    if(!regpw.test(this.credentials.pw)){
      this.showAlertPass("A sua password é inválida! Para mais informações clique em 'Ajuda'.");
      return;
    }

    this.auth.register(this.credentials).subscribe(async res => {
      if (res) {
        if(res==1){
          this.showAlert("Erro desconhecido! Por favor tente novamente.");
        }else if(res==2){
          this.showAlert("Esse email já está a ser utilizado!");
        }else if(res==0){
          this.router.navigateByUrl('/login');
          const toast = await this.toastCtrl.create({
            message: 'Registo concluido com sucesso! Faça login utilizando as suas credenciais.',
            duration: 6500,
            position: 'bottom'
          });
        
          toast.present();
        }
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

  async showAlertPass(msg: string){
    const alert = await this.alertCtrl.create({
      header: 'Falha no Registro',
      message: msg,
      buttons: [{
        text: 'Ajuda',
        handler: async () => {
          alert.dismiss();
          const alert2 = await this.alertCtrl.create({
            header: 'Informações de Segurança',
            message: "Uma password válida deve ser constituida por pelo menos 8 caracteres, entre eles devem estar 1 letra maiúscula, 1 letra minúscula e 1 número.",
            buttons: ['OK']
          });
          await alert2.present();
        }
      }, {
        text: 'OK',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

}
