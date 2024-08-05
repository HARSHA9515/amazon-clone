import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isAdmin: boolean = false; // Input property to determine admin or user view
  searchTxt: string = '';
  theme = 'light'; // Set the initial theme to light

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ){}

  logout(){
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    })
  }

  onFilter() {
    this.userService.searchBox.next(this.searchTxt);
  }

  onInput(event: any) {
    if (event.target.value.trim() === '') {
      this.onFilter();
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}
