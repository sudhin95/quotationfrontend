import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuotationsService } from '../quotations.service';

/**
 * QuotationListComponent
 * Displays all quotations in a table with search/filter, edit, and delete capabilities.
 */
@Component({
  selector: 'app-quotations-list',
  templateUrl: './quotations-list.component.html',
  styleUrls: ['./quotations-list.component.css']
})
export class QuotationsListComponent implements OnInit {

  quotations: any[] = [];
  filteredQuotations: any[] = [];
  searchTerm = '';
  isLoading = true;
  showFilters = false;
  filterStatus = '';
  filterQuotationDate = '';
  filterCreatedDate = '';

  // Delete confirmation dialog state
  showDeleteDialog = false;
  quotationToDelete: any | null = null;

  // Toast notification
  toastMessage = '';
  toastType = 'success';
  showToast = false;

  constructor(
    private quotationsService: QuotationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuotations();
  }

   toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

   get activeFilterCount(): number {
    let count = 0;
    if (this.filterStatus !== '') count++;
    if (this.filterQuotationDate !== '') count++;
    if (this.filterCreatedDate !== '') count++;
    return count;
  }


  clearFilters(): void {
    this.filterStatus = '';
    this.filterQuotationDate = '';
    this.filterCreatedDate = '';
    this.applyFilter();
  }


  /**
   * Fetch all quotations from the service.
   */
  loadQuotations(): void {
    this.isLoading = true;
    this.quotationsService.getQuotations().subscribe((data:any) => {
      console.log('Fetched quotations:', data);
      if(data && data.body && Array.isArray(data.body)) {
        this.quotations = data.body;
      }
      this.applyFilter();
      this.isLoading = false;
    });
  }

  /**
   * Filter the quotation list by name, company, or email.
   */


  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredQuotations = this.quotations.filter(quotation => {

      const matchesSearch = !term ||
        (quotation.quotationnumber ?? '').toString().toLowerCase().includes(term) ||
        (quotation.phone ?? '').toString().toLowerCase().includes(term) ||
        (quotation.email ?? '').toLowerCase().includes(term) ||
        (quotation.title ?? '').toLowerCase().includes(term) ||
        (quotation.totalamount ?? '').toString().toLowerCase().includes(term)
      const matchesStatus = this.filterStatus === '' ||
        Number(quotation.status) === Number(this.filterStatus);

      const matchesQuotationDate = this.filterQuotationDate === '' ||
        this.isSameDate(quotation.quotationdate, this.filterQuotationDate);

      const matchesCreatedDate = this.filterCreatedDate === '' ||
        this.isSameDate(quotation.createdon, this.filterCreatedDate);

      return matchesSearch && matchesStatus && matchesQuotationDate && matchesCreatedDate;
    });
  }

  private isSameDate(dbDateValue: string, filterDateValue: string): boolean {
    if (!dbDateValue) return false;
    const dbDate = new Date(dbDateValue);
    const dbDateStr = dbDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
    return dbDateStr === filterDateValue;
  }

  /**
   * Navigate to the create form.
   */
  addQuotation(): void {
    this.router.navigate(['/quotations/new']);
  }

  /**
   * Navigate to the edit form for a specific quotation.
   */
  editQuotation(quotation: any): void {
    this.router.navigate(['/quotations/edit', quotation.quotationid]);
  }

  /**
   * Show the delete confirmation dialog.
   */
  confirmDelete(quotation: any): void {
    this.quotationToDelete = quotation;
    this.showDeleteDialog = true;
  }

  /**
   * Actually delete the client after confirmation.
   */
  deleteQuotation(): void {
    if (!this.quotationToDelete) return;
    console.log('Deleting quotation with ID:', this.quotationToDelete);
    this.quotationsService.deleteQuotation(this.quotationToDelete.quotationid).subscribe((data:any) => {
      if (data && data.header && data.header.return_status === true ) {
        this.showNotification(data.header.return_message, 'success');
        this.loadQuotations();
      } else {
        this.showNotification('Failed to delete quotation', 'error');
      }
      this.cancelDelete();
    });
  }

  /**
   * Close the delete dialog without deleting.
   */
  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.quotationToDelete = null;
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

    viewQuotation(quotation: any): void {
      this.router.navigate(['/quotations/view', quotation.quotationid]);
    }

   getStatusBadgeClass(statusName: string): string {
    switch ((statusName || '').toLowerCase()) {
      case 'draft':    return 'status-draft';
      case 'sent':     return 'status-sent';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default:         return '';
    }
  }
}
