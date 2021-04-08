import { Injectable, OnInit } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role, Customer, Transaction, Currency } from '../_models';

const users: User[] = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Benz', lastName: 'admin', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', firstName: 'Hilfiger', lastName: 'User', role: Role.User }
];

const customers: Customer[] = [
    { id: 2345, name: 'Venkat', address: 'HYD', phoneNumber: 123343433},
    { id: 2346, name: 'Malik', address: 'BLR', phoneNumber: 123343434},
    { id: 2347, name: 'Test', address: 'CHN', phoneNumber: 123343435},
    { id: 2348, name: 'Mine', address: 'KOL', phoneNumber: 123343436},
    { id: 2349, name: 'EMY', address: 'HYD', phoneNumber: 123343437},
    ];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor{
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body , params} = request;
        return of(null)
            .pipe(mergeMap(handleRoute()))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown
            .pipe(delay(500)).pipe(dematerialize());

        function handleRoute(): any {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/customers\/\w+$/) && method === 'GET':
                    return getCustomerByNumber();
                case url.endsWith('/transactions') && method === 'POST':
                    console.log('transactions logs');
                    return postTransaction();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions
        function authenticate(): any {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) { return error('Username or password is incorrect'); }
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: `fake-jwt-token.${user.id}`
            });
        }

        function getUsers(): any {
            if (!isAdmin()) { return unauthorized(); }
            return ok(users);
        }

        function getUserById(): any {
            if (!isLoggedIn()) { return unauthorized(); }
            // only admins can access other user records
            if (!isAdmin() && currentUser()?.id !== idFromUrl()) { return unauthorized(); }
            const user = users.find(x => x.id === idFromUrl());
            return of(new HttpResponse({ status: 200, }));
        }

        function getCustomerByNumber(): any {
            const customer = customers.find(x => x.id === idFromUrl());
            return ok(customer);
        }

        // helper functions
        function ok(resp?: any): any {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized(): any {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message: any): any {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn(): any {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin(): any {
            return isLoggedIn() && currentUser()?.role === Role.Admin;
        }

        function currentUser(): any {
            if (!isLoggedIn()) { return; }
            const id = parseInt(headers.get('Authorization')?.split('.')[1] || '');
            return users.find(x => x.id === id);
        }

        function idFromUrl(): any {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function postTransaction(): any {
            return ok(body);
        }
    }

}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
