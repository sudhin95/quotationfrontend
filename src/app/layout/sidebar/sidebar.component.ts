import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

/**
 * SidebarComponent
 * Dark-themed navigation sidebar with collapsible behaviour.
 * Menu items are defined here — easy to extend when adding quotation pages later.
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  // Navigation menu items — add more as the app grows
  menuItems = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Clients',
      route: '/clients',
      icon: 'clients'
    },
    {
      label: 'Quotations',
      route: '/quotations',
      icon: 'quotations',
      disabled: false  // Coming in a future phase
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onToggle(): void {
    this.toggleCollapse.emit();
  }

  logout(): void {
    // this.authService.logout();
  }

  /**
   * Check if a menu item's route is currently active.
   */
  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
