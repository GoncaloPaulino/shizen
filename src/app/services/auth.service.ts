import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

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
 
    return this.http.get('https://randomuser.me/api/').pipe(
      take(1),
      map(res => {
        // Extract the JWT, here we just fake it
        return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJuYW1lIjoiSm_Do28gQ8OjbyIsImVtYWlsIjoiam9hb0BjYW5pbC5wdCJ9.H6P_NPtSS-W_O8ggQr-Khj_S9zmBCON_C2lEtLJ_jDw`;
      }),
      switchMap(token => {
        let decoded = helper.decodeToken(token);
        this.userData.next(decoded);
 
        let storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
      })
    );
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
