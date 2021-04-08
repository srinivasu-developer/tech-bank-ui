import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
     })
export class LoginComponent implements OnInit {

    form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    loading = false;
    submitted = false;
    returnUrl?: string;
    error?: string;
    loginInvalid = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        // form: FormGroup
        private authenticationService: AuthenticationService
        // private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        console.log('on submitted');
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    this.loginInvalid = true;
                });
        /*try {
            const username = this.f.username.value;
            const password = this.f.password.value;
            await this.authenticationService.login(username, password);
        } catch (err) {

      }*/

    }
}
