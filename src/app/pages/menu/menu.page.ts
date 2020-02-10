import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Perfil',
      url: '/profile',
      icon: 'contact'
    },
    {
      title: 'Lista de Plantas',
      url: '/list',
      icon: 'list'
    }
  ];

  selectedPath = '';

  constructor(private router : Router, private auth: AuthService) {
    this.router.events.subscribe((event: RouterEvent) =>{
      this.selectedPath=event.url;
    });
  }

  ngOnInit() {
  }

  logout(){
    this.auth.logout();
  }

}
