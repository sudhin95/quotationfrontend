import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationsListComponent } from './quotations-list/quotations-list.component';
import { QuotationsFormComponent } from './quotations-form/quotations-form.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: QuotationsListComponent },
  { path: 'new', component: QuotationsFormComponent },
  { path: 'edit/:id', component: QuotationsFormComponent }
];

@NgModule({
  declarations: [
    QuotationsListComponent,
    QuotationsFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class QuotationsModule { }
