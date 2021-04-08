import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Customer } from '../_models';

@Injectable({ providedIn: 'root' })
export class CustomerService {

    constructor(private http: HttpClient) { }

    getAll(): any {
        return this.http.get<Customer[]>(`/customers`);
    }

    getByName(name: string): any {
        return this.http.get<Customer>(`/customers/${name}`);
    }
}
