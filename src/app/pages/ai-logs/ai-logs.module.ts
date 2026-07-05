import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiLogsListComponent } from './ai-logs-list/ai-logs-list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: AiLogsListComponent },
 
];

@NgModule({
  declarations: [
    AiLogsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class AiLogsModule { }
