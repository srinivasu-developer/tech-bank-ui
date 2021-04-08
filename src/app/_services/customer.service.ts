import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Customer } from '../_models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Customer[]>(`/customers`);
    }

    getByName(name: string) {
        return this.http.get<Customer>(`/customers/${name}`);
    }
}
