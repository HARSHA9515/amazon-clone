import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private role: string | null = null;
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Check session on initialization
    this.authService.checkSession().subscribe({
      next: (response) => {
        this.role = response.role;
        if (!response.role) {
          this.router.navigate(['/login']);
        } else if (this.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if(this.router.url.includes("/admin-dashboard") && this.role !== 'admin'){
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.role = null;
        this.router.navigate(['/login']);
      }
    });
  }
}
