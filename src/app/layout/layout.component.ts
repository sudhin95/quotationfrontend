import { Component } from '@angular/core';

/**
 * LayoutComponent
 * Main application shell — houses the sidebar, header, and the content area.
 * Uses a boolean flag to toggle sidebar collapse on smaller screens.
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarCollapsed = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
