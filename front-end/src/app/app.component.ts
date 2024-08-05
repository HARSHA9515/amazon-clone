import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { AuthService } from './shared/services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'amazon';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Check session on initialization
    this.authService.checkSession().subscribe({
      next: (response) => {
        if (!response.role) {
          this.router.navigate(['/login']);
        } else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin-dashboard']);
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });

    // Listen for router events
    this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.checkAdminAccess(event.url);
      }
    });
  }

  private checkAdminAccess(url: string) {
    if (url.includes('/admin-dashboard') && !this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }
  }
}
