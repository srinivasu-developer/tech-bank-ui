import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { AuthGuard } from './_guards';
import { Role } from './_models';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
        {
        	path: 'new-transaction',
			component: NewTransactionComponent,
        },
        {
        	path: 'view-transactions',
			component: TransactionListComponent,
        },
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'login',
        component: LoginComponent
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
