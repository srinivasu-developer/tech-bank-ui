import { Component, OnInit } from '@angular/core';

import { User, Role } from '../../_models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  title = 'TechBank';
  currentUser?: User | null;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    get isAdmin(): any {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    logout(): void {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
