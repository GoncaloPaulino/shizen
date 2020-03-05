import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
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
    private plt: Platform, private router: Router) { 
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
    // Normally make a POST request to your APi with your login credentials
    if (credentials.email != 'test' || credentials.pw != 'test') {
      return of(null);
    }
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'application/x-www-form-urlencoded'
        }),
        responseType: 'text' as "json",
    };
    let body = 'mail=' + credentials.email + '&pw=' + credentials.pw;
    this.http.post<string>(AUTH_LOGIN, body, httpOptions);
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
