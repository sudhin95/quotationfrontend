import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Client } from '../../../shared/models/client.model';

/**
 * ClientListComponent
 * Displays all clients in a table with search/filter, edit, and delete capabilities.
 */
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  isLoading = true;

  // Delete confirmation dialog state
  showDeleteDialog = false;
  clientToDelete: Client | null = null;

  // Toast notification
  toastMessage = '';
  toastType = 'success';
  showToast = false;

  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  /**
   * Fetch all clients from the service.
   */
  loadClients(): void {
    this.isLoading = true;
    this.clientsService.getClients().subscribe(clients => {
      this.clients = clients;
      this.applyFilter();
      this.isLoading = false;
    });
  }

  /**
   * Filter the client list by name, company, or email.
   */
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredClients = [...this.clients];
      return;
    }

    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.company.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term)
    );
  }

  /**
   * Navigate to the create form.
   */
  addClient(): void {
    this.router.navigate(['/clients/new']);
  }

  /**
   * Navigate to the edit form for a specific client.
   */
  editClient(client: Client): void {
    this.router.navigate(['/clients/edit', client.id]);
  }

  /**
   * Show the delete confirmation dialog.
   */
  confirmDelete(client: Client): void {
    this.clientToDelete = client;
    this.showDeleteDialog = true;
  }

  /**
   * Actually delete the client after confirmation.
   */
  deleteClient(): void {
    if (!this.clientToDelete) return;

    this.clientsService.deleteClient(this.clientToDelete.id).subscribe(success => {
      if (success) {
        this.showNotification('Client deleted successfully', 'success');
        this.loadClients();
      } else {
        this.showNotification('Failed to delete client', 'error');
      }
      this.cancelDelete();
    });
  }

  /**
   * Close the delete dialog without deleting.
   */
  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.clientToDelete = null;
  }

  /**
   * Show a toast notification that auto-hides after 3 seconds.
   */
  private showNotification(message: string, type: string): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
