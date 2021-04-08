import { Customer } from './customer';
import { Currency } from './currency';

export class Transaction {

    customer?: Customer;
    transferAmount?: number;
    currency?: string;
    beneficiaryBank?: string;
    beneficiaryAcc?: string;
    paymentDetails?: string;
    cardDetails?: string;
    region?: string;
    type?: string;
    reference?: string;

}
