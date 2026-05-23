import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'devmirror_token';
  
  // Signals for reactive state management
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);


  http = inject(HttpClient)
  router = inject(Router)


  register(data : { email: string; username : string; password: string ; fullName?: string}) {
      return this.http.post<AuthResponse>(`api/auth/register`, data).pipe(
        tap((res) => this.handleAuth(res))
      )


      

  }


  login (data : {email: string ; password : string}){
        return this.http.post<AuthResponse>(`api/auth/login`, data).pipe(
          tap((res) => this.handleAuth(res))
        )
      }

      logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/auth/login']);
      }


      getToken() : string | null {
        return localStorage.getItem(this.TOKEN_KEY);
      }


      private handleAuth(res: AuthResponse) {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
        this.router.navigate(['/dashboard']);
      }


      private loadUserFromToken() {
        const token = this.getToken();
        if (token) {
          

          // check if the token is valid yet

          this.http.get<User>('api/auth/me').subscribe({
            next: (user) => {
              this.currentUser.set(user);
              this.isAuthenticated.set(true);
            },
            error: () => {
              this.logout();
            }
          });
        }
      }

}
