import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, take, map, switchMap } from 'rxjs/operators';
import { API } from 'src/const';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {}

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      
      this.showAlert("Sucesso", "Imagem carregada com sucesso!");
      console.log(imageData)
      let bin = this.convertDataURIToBinary(imageData)
      this.showAlert("OK", "OK");
    }, (err) => {
      this.showAlert("Erro", "Ocorreu um erro, por favor tente novamente.");
    });
  }

  convertDataURIToBinary(dataURI) {
    var raw = window.atob(dataURI);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
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

  classifyImage(path: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'image/jpeg'
        })
    };
    let body = "";
    return this.http.post<string>(API + "recognize", body, httpOptions).pipe(
      take(1),
      map(res => {
        return res;
      }),
      switchMap(res => {
        return res;
      }),
      catchError(error => this.handleError(error))
    );
  }
  
  async handleError(error: any){
    let msg = "";
    if(error instanceof HttpErrorResponse){
      msg = "Ocorreu um erro ao estabelecer uma conexão com o servidor."
    }else{
      msg = "Ocorreu um erro desconhecido."
    }
    this.showAlert("Erro", msg);
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
