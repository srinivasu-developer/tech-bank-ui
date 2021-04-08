import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../_models/transaction';
import { TransactionService } from '../_services/transaction.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit,  AfterViewInit {

  displayedColumns = ['reference', 'customerName', 'transferAmt', 'transferCurrency'];

  transactions?: Transaction[] = [];

  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(private http: HttpClient, private transactionService: TransactionService) {
    this.transactions = transactionService.getTransactions();
    this.dataSource = new MatTableDataSource(this.transactions);

  }

  ngOnInit(): void {

  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: any): void {
    filterValue = filterValue.value.trim(); // Remove whitespace if any
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
