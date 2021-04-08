import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { User, Role, Customer, Transaction, Currency } from '../_models';

const customers: Customer[] = [
    { id: 2345, name: 'Venkat', address: 'HYD', phoneNumber: 123343433},
    { id: 2346, name: 'Malik', address: 'BLR', phoneNumber: 123343434},
    { id: 2347, name: 'Test', address: 'CHN', phoneNumber: 123343435},
    { id: 2348, name: 'Mine', address: 'KOL', phoneNumber: 123343436},
    { id: 2349, name: 'EMY', address: 'HYD', phoneNumber: 123343437},
    ];

const CURRENCIES: Currency[] = [Currency.AED, Currency.CHF, Currency.EUR, Currency.MUR, Currency.USD];

const BANKS: string[] = ['HDFC', 'SBI', 'ICICI', 'CANARA'];

const REGIONS: string[] = ['Port Louis', 'Curepipe', 'Vacoas', 'Port Mathurin'];

const TYPES: string[] = ['New', 'Existing'];


@Injectable({ providedIn: 'root' })
export class TransactionService {

    transactions: Transaction[] = [];

    constructor(private http: HttpClient, private router: Router) {
        for (let i = 1; i <= 100; i++) { this.transactions.push(this.createNewTransaction()); }
    }

    generateReference(): string {
        const pipe = new DatePipe('en-US');
        let reference = 'CUS';
        const today = pipe.transform(Date.now(), 'YYYYMMdd');
        const sequenceNumber = Math.round(Math.random() * 9999);
        reference = reference + today + sequenceNumber;
        return reference;
    }

    postTransaction(transaction: Transaction) {
        return this.http.post<any>(`/transactions`, transaction).subscribe(data => {
            this.transactions.push(data.value);
            this.router.navigate(['/view-transactions']);
        });
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    /*postTransaction() {
        return this.http.post<Transaction>(`/transaction/${transaction.reference}`, transaction).subscribe(data =>{
            this.transactions.push(data);
        });
    }*/


    createNewTransaction(): Transaction {
        const pipe = new DatePipe('en-US');
        let reference = 'CUS';
        const today = pipe.transform(Date.now(), 'YYYYMMdd');
        const sequenceNumber = Math.round(Math.random() * 9999);
        reference = reference + today + sequenceNumber;
        return {
        reference: reference.toString(),
        customer: customers[Math.round(Math.random() * (customers.length - 1))],
        transferAmount: Math.round(Math.random() * 10000),
        currency: CURRENCIES[Math.round(Math.random() * (CURRENCIES.length - 1))],
        beneficiaryBank: BANKS[Math.round(Math.random() * (BANKS.length - 1))],
        beneficiaryAcc: Math.round(Math.random() * 99999999999).toString(),
        paymentDetails: 'CARD',
        cardDetails: Math.round(Math.random() * 99999999999).toString(),
        region: REGIONS[Math.round(Math.random() * (REGIONS.length - 1))],
        type: TYPES[Math.round(Math.random() * (TYPES.length - 1))],
  };
}

}
