import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient)


  getProfile(username :string) {
    return this.http.get<User>(`/api/users/${username}`)
  }


  updateProfile(data : Partial<User>) {
    return this.http.put<User>(`/api/users/me`, data)
  }

  searcUsers(query :string) {
    return this.http.get<Partial<User>[]>(`/api/users/search?q=${query}`)
  }
}

