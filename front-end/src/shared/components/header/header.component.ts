import { Component } from '@angular/core';
import { UserService } from '../../../app/user.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule,RouterOutlet, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchTxt: string = '';
  theme = 'light'; // Set the initial theme to light

  constructor(private userService: UserService, private router: Router){}
  logout(){
    this.userService.logout().subscribe(() => {
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
