import {Component} from '@angular/core';
import {LOGIN_PATH, RATE_PATH} from "./app-routing.module";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  routerLinkPath = RATE_PATH;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  onLogout() {
    this.authService.setCurrentUser('');
    this.router.navigate([LOGIN_PATH]);
  }
}
