import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private alertCtrl: AlertController){}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>{
    return this.auth.user.pipe(
      take(1),
      map(user => {
        if(!user){
          this.showAlert();
          
          this.router.navigateByUrl('/');
          return false;
        }else{
          return true;
        }
      })
    );
  }

  async showAlert(){
    let alert = await this.alertCtrl.create({
      header: 'Acesso não autorizado',
      message: 'Por favor faça login para pode acessar a outras abas!',
      buttons: ['Ok']
    });
    alert.present();
  }
  
}
