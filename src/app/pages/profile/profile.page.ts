import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  user = null;
 
  constructor(private auth: AuthService) {
    this.user = this.auth.getUser();
  }
 
  logout() {
    this.auth.logout();
  }

}
