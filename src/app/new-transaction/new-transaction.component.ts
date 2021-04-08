import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Customer } from '../_models/customer';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../_services/customer.service';
import { TransactionService } from '../_services/transaction.service';
import { Currency } from '../_models/currency';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {

  loading = false;
  submitted = false;
  error?: string;
  customerNotFound = false;
  transactionForm = this.buildTransactionForm();
  regions = ['Port Louis', 'Curepipe', 'Vacoas', 'Port Mathurin'];
  currencies = [Currency.AED, Currency.EUR, Currency.CHF, Currency.MUR, Currency.USD];

  @Output() change?: EventEmitter<MatRadioChange>;

  constructor(
        private formBuilder: FormBuilder,
        private customerService: CustomerService,
        private transactionService: TransactionService
    ) { }


  ngOnInit(): void {
    this.buildTransactionForm();
  }

  buildTransactionForm(): any {
  	this.transactionForm = this.formBuilder.group(
  	{
     	type: [''],
        reference: [this.transactionService.generateReference()],
        customer: this.formBuilder.group({
        	id: ['', Validators.required],
        	name: [ {value: '', disabled: true}, Validators.required],
        	address: [ {value: '', disabled: true}, Validators.required],
        	phoneNumber: [ {value: '', disabled: true}, Validators.required],

        } ),
		transferAmount: ['', Validators.required],
    	currency: ['', Validators.required],
    	beneficiaryBank: ['', Validators.required],
    	beneficiaryAcc: ['', Validators.required],
    	paymentDetails: ['', Validators.required],
    	cardDetails: ['', [ Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)] ],
    	region: ['', Validators.required],
    });
  }

  onSelectingCustomerNumber(number: any): any {
  	const { customer } = this.transactionForm.value;
  	this.customerService.getByName(customer.id).subscribe({
  		next: (data: any) => {
  			this.name.setValue(data.name);
  			this.address.setValue(data.address);
  			this.phoneNumber.setValue(data.phoneNumber);
  		},
  		error: (error: any) => {
  			this.customerNotFound = true;
			  this.name.setValue('No customer name found');
  			this.address.setValue('No address found');
  			this.phoneNumber.setValue('No phone number found');
  		}
  	});
  }

  onSubmit(): void {
  	if (this.transactionForm.invalid) {
            return;
	}
  	this.transactionService.postTransaction(this.transactionForm);
  }

  changeTransactionType(mrChange: MatRadioChange): void {
  	if (mrChange.value === 'Existing') {
  		this.f.reference.setValue('');
  	} else {
  		this.f.reference.setValue(this.transactionService.generateReference());
  	}
  }

  get f(): any { return this.transactionForm?.controls; }


  get id(): any {
    return this.transactionForm?.get('customer.id');
  }

  get name(): any {
    return this.transactionForm?.get('customer.name');
  }

  get address(): any {
    return this.transactionForm?.get('customer.address');
  }

  get phoneNumber(): any {
    return this.transactionForm?.get('customer.phoneNumber');
  }

  get customer(): Customer {
  	return this.transactionForm?.get('customer');
  }

  set customer(customer: Customer) {
  	this.customer = customer;
  }

}

