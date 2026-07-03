import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Client } from '../../shared/models/client.model';

/**
 * ClientsService
 * Manages client data using localStorage for persistence.
 * All methods return Observables so that switching to HTTP later is seamless —
 * just swap `of(...)` with `this.http.get(...)` etc.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private readonly STORAGE_KEY = 'qb_clients';

  constructor() { }

  /**
   * Get all clients, sorted by most recently created.
   */
  getClients(): Observable<Client[]> {
    const clients = this.readFromStorage();
    // Sort newest first
    clients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return of(clients);
  }

  /**
   * Get a single client by ID.
   * Returns null if not found.
   */
  getClient(id: string): Observable<Client | null> {
    const clients = this.readFromStorage();
    const found = clients.find(c => c.id === id) || null;
    return of(found);
  }

  /**
   * Create a new client.
   * Generates a unique ID and timestamps automatically.
   */
  createClient(data: Partial<Client>): Observable<Client> {
    const clients = this.readFromStorage();

    const newClient: Client = {
      id: this.generateId(),
      name: data.name || '',
      company: data.company || '',
      email: data.email || '',
      phone: data.phone || '',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    clients.push(newClient);
    this.saveToStorage(clients);
    return of(newClient);
  }

  /**
   * Update an existing client by ID.
   * Merges the provided fields with the existing record.
   */
  updateClient(id: string, data: Partial<Client>): Observable<Client | null> {
    const clients = this.readFromStorage();
    const index = clients.findIndex(c => c.id === id);

    if (index === -1) {
      return of(null);
    }

    // Merge updated fields, refresh the updatedAt timestamp
    clients[index] = {
      ...clients[index],
      name: data.name ?? clients[index].name,
      company: data.company ?? clients[index].company,
      email: data.email ?? clients[index].email,
      phone: data.phone ?? clients[index].phone,
      notes: data.notes ?? clients[index].notes,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage(clients);
    return of(clients[index]);
  }

  /**
   * Delete a client by ID.
   * Returns true if the client was found and removed.
   */
  deleteClient(id: string): Observable<boolean> {
    let clients = this.readFromStorage();
    const initialLength = clients.length;
    clients = clients.filter(c => c.id !== id);

    if (clients.length < initialLength) {
      this.saveToStorage(clients);
      return of(true);
    }

    return of(false);
  }

  // ---- Private helpers ----

  private readFromStorage(): Client[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(clients: Client[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clients));
  }

  /**
   * Generate a simple unique ID.
   * Good enough for localStorage; in production the backend would handle this.
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }
}
