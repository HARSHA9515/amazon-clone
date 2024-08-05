import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatCardModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  error!: string;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.user.role === 'user') {
            this.router.navigate(['/']);
          }
        },
        (error: { message: string; }) => {
          this.error = 'Invalid username or password';
        }
      );
    }
  }

  resetError(): void {
    this.error = '';
  }

}
