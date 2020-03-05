import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { switchMap, map, take, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import '../../const'
import { AUTH_LOGIN } from '../../const';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(private storage: Storage, private http: HttpClient,
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
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'application/x-www-form-urlencoded'
        })
    };
    let body = 'mail=' + credentials.email + '&pw=' + credentials.pw;
    return this.http.post<string>(AUTH_LOGIN, body, httpOptions).pipe(
      take(1),
      map(res => {
        return res;
      }),
      switchMap(res => {
        if(res["result_code"]!=0)
          return of("AUTH_ERROR");
        let token = res["user_jwt"];
        let decoded = helper.decodeToken(token);
        console.log("Login decoded: ", decoded);
        this.userData.next(decoded);
 
        let storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
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
    const alert = await this.alertCtrl.create({
      header: "Erro",
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  register(credentials: {name: string, email: string, pw: string }) {
    return of(null);
  }

  getUser() {
    return this.userData.getValue();
  }
 
  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }
}
