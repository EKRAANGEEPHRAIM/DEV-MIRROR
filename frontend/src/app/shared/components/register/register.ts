import { Component, inject, signal } from '@angular/core';
import { RegisterFormData, registerSchema } from '../../validators/auth.validators';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form : RegisterFormData = {
    email: '',
    password: '',
    username: '',
    fullName: ''
  }

  //record  allows us to create a type with dynamic keys
  errors = signal<Partial<Record<keyof RegisterFormData, string>>>({});

  apiError = signal<string>('');
  loading = signal<boolean>(false);


  authService = inject(AuthService);

  onSubmit() {
    const result = registerSchema.safeParse(this.form)

    if(!result.success){
      const fielErrors : Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof RegisterFormData;
        fielErrors[field] = issue.message;
      });
      this.errors.set(fielErrors);
      return;
    }

    this.errors.set({});
    this.loading.set(true);
    

    this.authService.register(this.form).subscribe({
      error: (err) => {
        this.apiError.set(err.error.message || 'Registration failed');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    })
    
    
  }
}
