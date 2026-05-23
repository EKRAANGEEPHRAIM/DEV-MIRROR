import {  loginSchema } from './../../validators/auth.validators';
import { Component, inject, signal } from '@angular/core';
import { LoginFormData } from '../../validators/auth.validators';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule,RouterLink , FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: LoginFormData = {
    email: '',
    password: ''
  }


  errors = signal<Partial<LoginFormData>>({});

  apiError = signal<string>('');
  loading = signal<boolean>(false);


  authService = inject(AuthService)


  onSubmit(){
    //zod validation
    const result = loginSchema.safeParse(this.form);

    if(!result.success){
      const fieldErrors : Partial<LoginFormData> = {};
     result.error.issues.forEach(issue => {
       const field = issue.path[0] as keyof LoginFormData;
       fieldErrors[field] = issue.message;
     });
     this.errors.set(fieldErrors);

     return;
    
    }

    this.errors.set({});
    this.loading.set(true);
    this.apiError.set('');


    this.authService.login(this.form).subscribe({
      error: (error) => {
        this.apiError.set(error.error.message || 'An error occurred');
        this.loading.set(false);
      },

      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
