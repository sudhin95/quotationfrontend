import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  // Login — lazy-loaded, no guard
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // Protected routes — wrapped in LayoutComponent
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'clients',
        loadChildren: () => import('./pages/clients/clients.module').then(m => m.ClientsModule)
      },
      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Catch-all — redirect to dashboard (guard will handle unauthenticated)
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
