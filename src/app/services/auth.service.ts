import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { switchMap, map, take, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import '../../const'
import { AUTH_LOGIN, AUTH_REG, PASS_RECOVER } from '../../const';
import { HTTP } from '@ionic-native/http/ngx';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
const USER_FAVS_KEY = 'user-fav';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(private storage: Storage, private http: HTTP,
    private plt: Platform, private router: Router,
    private alertCtrl: AlertController) { 
      this.loadStoredToken();
     }

  loadStoredToken(){
    let platObs = from(this.plt.ready());
    this.user = platObs.pipe(
      switchMap(() =>{
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if(token){
          let decoded = helper.decodeToken(token as string);

          this.userData.next(decoded);
          return true;
        }else{
          return null;
        }
      })
    );
  }

  login(credentials: {email: string, pw: string }) {
    const httpOptions = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    let body = 'mail=' + credentials.email + '&pw=' + credentials.pw;

    this.http.setDataSerializer( "utf8" );
    let call = this.http.post(AUTH_LOGIN, body, httpOptions);
    return from(call).pipe(
      take(1),
      map(res => {
        return res;
      }),
      switchMap(res => {
        let json_data = JSON.parse(res.data);
        if(json_data["result_code"]!=0)
          return of("AUTH_ERROR");
        let token = json_data["user_jwt"];
        let decoded = helper.decodeToken(token);
        this.userData.next(decoded);
 
        let storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
      }),
      catchError(error => this.handleError(error))
    );
  }

  async handleError(error: any){
    let msg = "";
    if(error["status"]==-4){
      msg = "Ocorreu um erro ao estabelecer uma conexão com o servidor.";
    }else{
      msg = "Ocorreu um erro desconhecido.";
    }
    const alert = await this.alertCtrl.create({
      header: "Erro",
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  register(credentials: {name: string, email: string, pw: string }) {
    const httpOptions = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  let body = 'mail=' + credentials.email + '&pw=' + credentials.pw + "&name=" + credentials.name;

  this.http.setDataSerializer( "utf8" );
  let call = this.http.post(AUTH_REG, body, httpOptions);
  return from(call).pipe(
    take(1),
    map(res => {
      return res;
    }),
    switchMap(res => {
      return res.data;
    }),
    catchError(error => this.handleError(error))
  );
  }

  recoverPassword(email: string) {
    const httpOptions = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    let body = 'mail=' + email;

    this.http.setDataSerializer( "utf8" );
    let call = this.http.post(PASS_RECOVER, body, httpOptions);
    return from(call).pipe(
      take(1),
      map(res => {
        return res;
      }),
      switchMap(res => {
        console.log(res.data);
        return res.data;
      }),
      catchError(error => this.handleError(error))
    );
  }

  getUser() {
    return this.userData.getValue();
  }
 
  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.userData.next(null);
      this.storage.remove(USER_FAVS_KEY).then(()=>{
        this.router.navigateByUrl('/login');
      });
    });
  }
}
