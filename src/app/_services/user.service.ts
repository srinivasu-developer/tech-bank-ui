import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(): any {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number): any {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }
}
