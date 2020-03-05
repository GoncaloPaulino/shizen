import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.showAlert("Sucesso", "Correu tudo bem!");
    }, (err) => {
      this.showAlert("Erro", "Ocorreu um erro, por favor tente novamente.");
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selecionar Imagem",
      buttons: [{
        text: 'Carregar da Galeria',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Tirar Foto',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
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
