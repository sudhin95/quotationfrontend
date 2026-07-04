import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationsListComponent } from './quotations-list/quotations-list.component';
import { QuotationsFormComponent } from './quotations-form/quotations-form.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';

const routes: Routes = [
  { path: '', component: QuotationsListComponent },
  { path: 'new', component: QuotationsFormComponent },
  { path: 'edit/:id', component: QuotationsFormComponent },
  { path: 'view/:id', component: QuotationViewComponent }

];

@NgModule({
  declarations: [
    QuotationsListComponent,
    QuotationsFormComponent,
    QuotationViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild(routes),
  ]
})
export class QuotationsModule { }
