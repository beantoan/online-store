import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Online Store';

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authService.loggedOut$.subscribe({
      next: (val) => {
        if (val) {
          this.router.navigate(['/login']);
        }
      }
    })
  }


  logout() {
    this.authService.logout();
  }
}
