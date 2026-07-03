import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/models/user.model';

/**
 * HeaderComponent
 * Top bar that shows the current page title, user info, and actions.
 * Page title is derived from the current route.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() menuToggle = new EventEmitter<void>();

  pageTitle = 'Dashboard';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Get current user
 

    // Update page title based on route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  logout(): void {
    // this.authService.logout();
  }

  /**
   * Derive a readable page title from the current URL path.
   */
  private updatePageTitle(): void {
    const url = this.router.url;

    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/clients/new')) {
      this.pageTitle = 'New Client';
    } else if (url.includes('/clients/edit')) {
      this.pageTitle = 'Edit Client';
    } else if (url.includes('/clients')) {
      this.pageTitle = 'Clients';
    } else if (url.includes('/quotations')) {
      this.pageTitle = 'Quotations';
    } else {
      this.pageTitle = 'Dashboard';
    }
  }
}
