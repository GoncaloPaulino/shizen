import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { empty } from 'rxjs';

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

  ionViewWillEnter(){
    this.user = this.auth.getUser();
  }
 
  logout() {
    this.auth.logout();
  }

  //Alterar o nome de utilizador
  async changename(){
    let alert = await this.alertCtrl.create({
      header: "Editar Nome",
      message: "Digite o seu novo nome e a sua password.",
      buttons: [
        {
          text: 'Editar',
          handler: async data => {
            let nn = data.name;
            let pw = data.pw;
            await alert.dismiss();
            if(nn == ""){
              this.showAlert("Atenção", "Tem de inserir um novo nome.");
              return;
            }
            if(pw==""){
              this.showAlert("Atenção", "Tem de inserir a sua palavra-passe.");
              return;
            }
            await this.auth.changeUserName(nn,pw);
          }
        }, 
        {
        text: 'Cancelar',
        role: 'cancel'
      }],
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Novo nome'
        },
        {
          name: 'pw',
          type: 'password',
          placeholder: 'Palavra-passe'
        }
      ]
    });
    await alert.present();
  }

  //Alterar o email do utilizador
  async changemail(){
    let alert = await this.alertCtrl.create({
      header: "Editar E-mail",
      message: "Digite o seu novo email e a sua password.",
      buttons: [
        {
          text: 'Editar',
          handler: async data => {
            let em = data.email;
            let pw = data.pw;
            await alert.dismiss();
            if(em==""){
              this.showAlert("Atenção", "Tem de inserir um novo e-mail.");
              return;
            }
            var regemail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if(!regemail.test(em)){
              this.showAlert("Erro", "O email fornecido é inválido!");
              return;
            }
            if(pw==""){
              this.showAlert("Atenção", "Tem de inserir a sua palavra-passe.");
              return;
            }
            await this.auth.changeEmail(em,pw);
          }
        }, 
        {
        text: 'Cancelar',
        role: 'cancel'
      }],
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'Novo e-mail'
        },
        {
          name: 'pw',
          type: 'password',
          placeholder: 'Palavra-passe'
        }
      ]
    });
    await alert.present();
  }

  //Alterar a password do utilizador
  async changepass(){
    let alert = await this.alertCtrl.create({
      header: "Mudar Password",
      message: "Digite a sua nova password e a sua password antiga.",
      buttons: [
        {
          text: 'Mudar',
          handler: async data => {
            let npw = data.npw;
            let pw = data.pw;
            await alert.dismiss();
            if(npw==""){
              this.showAlert("Atenção", "Tem de inserir uma nova palavra-passe.");
              return;
            }
            var regpw = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
            if(!regpw.test(npw)){
              this.showAlertPass("A sua nova palavra-passe é inválida! Para mais informações clique em 'Ajuda'.");
              return;
            }
            if(pw==""){
              this.showAlert("Atenção", "Tem de inserir a sua palavra-passe antiga.");
              return;
            }
            await this.auth.changePassword(pw,npw)
          }
        }, 
        {
        text: 'Cancelar',
        role: 'cancel'
      }],
      inputs: [
        {
          name: 'npw',
          type: 'password',
          placeholder: 'Nova palavra-passe'
        },
        {
          name: 'pw',
          type: 'password',
          placeholder: 'Palavra-passe antiga'
        }
      ]
    });
    await alert.present();
  }

  async showAlert(hdr: string, msg: string){
    let alert = await this.alertCtrl.create({
      header: hdr,
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  //Mensagem de erro com informação sobre como construir uma boa palavra-passe
  async showAlertPass(msg: string){
    const alert = await this.alertCtrl.create({
      header: 'Falha no Registro',
      message: msg,
      buttons: [{
        text: 'Ajuda',
        handler: async () => {
          await alert.dismiss();
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
