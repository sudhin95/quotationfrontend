import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../clients.service';

/**
 * ClientFormComponent
 * Handles both Create and Edit modes for a client record.
 * The mode is determined by the presence of an ':id' route param.
 */
@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  clientForm!: FormGroup;
  isEditMode = false;
  clientId = '';
  isLoading = false;
  isSaving = false;
  pageTitle = 'New Client';

  // Toast state
  toastMessage = '';
  toastType = 'success';
  showToast = false;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    console.log('ClientFormComponent initialized');

    // Check if we're in edit mode by looking for an :id param
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = id;
      this.pageTitle = 'Edit Client';
      this.loadClient(id);
    }
  }

  /**
   * Set up the reactive form with validation rules.
   */
  private initForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      notes: ['']
    });
  }

  /**
   * Load existing client data for editing.
   */
  clients:any;
  private loadClient(id: string): void {
    console.log('Loading client for edit, ID:', id);
    this.isLoading = true;
    this.clientsService.getClient(id).subscribe((data:any) => {
      console.log('Fetched client data:', data);
      this.isLoading = false;
      this.clients = data.body[0];

      if (this.clients.length === 0) {
        this.showNotification('Client not found', 'error');
        this.router.navigate(['/clients']);
        return;
      }
      // Patch the form with existing values
      this.clientForm.patchValue({
        name: this.clients.name,
        company: this.clients.company,
        email: this.clients.email,
        phone: this.clients.phone,
        notes: this.clients.notes
      });
    });
  }

  /**
   * Handle form submission — create or update depending on mode.
   */
  onSubmit(): void {
    this.clientForm.markAllAsTouched();

    if (this.clientForm.invalid) {
      return;
    }
    this.isSaving = true;
    const formData = this.clientForm.value;
    console.log('Submitting form data:', formData, 'Edit mode:', this.isEditMode);
    if (this.isEditMode) {
      // Update existing client
      this.clientsService.updateClient(this.clientId, formData).subscribe(updated => {
        this.isSaving = false;
        if (updated) {
          this.showNotification('Client updated successfully', 'success');
          setTimeout(() => this.router.navigate(['/clients']), 1500);
        } else {
          this.showNotification('Failed to update client', 'error');
        }
      });
    } else {
      // Create new client
      this.clientsService.createClient(formData).subscribe((data:any) => {
        this.isSaving = false;
        console.log('Client created:', data);
        this.showNotification(data.header.return_message, 'success');
        setTimeout(() => this.router.navigate(['/clients']), 1500);
      });
    }
  }

 
  cancel(): void {
    this.router.navigate(['/clients']);
  }

  // Shortcut for template validation
  get f() {
    return this.clientForm.controls;
  }

  /**
   * Show a brief toast message.
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
