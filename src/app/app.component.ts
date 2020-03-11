import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { take, map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.auth.user.toPromise().then(user=>{
        if(!user){
          this.router.navigateByUrl('/login').then(()=>this.stopSplash());
        }else{
          this.router.navigateByUrl('/menu').then(()=>this.stopSplash());
        }
      });
    });
  }

  stopSplash() {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}
