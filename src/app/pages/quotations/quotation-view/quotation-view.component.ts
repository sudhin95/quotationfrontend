import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { QuotationService } from '../quotation.service'; // adjust path/name as needed
import { QuotationsService } from '../quotations.service';

@Component({
  selector: 'app-quotation-view',
  templateUrl: './quotation-view.component.html',
  styleUrls: ['./quotation-view.component.css']
})
export class QuotationViewComponent implements OnInit {
  quotation: any = null;
  isLoading = true;
  quotationId: string = '';
  companyInfo:any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quotationService: QuotationsService
  ) {}

  ngOnInit(): void {

    this.companyInfo = {
      name: 'Your Company Name',
      address: 'Building 123, Road 456, Manama, Bahrain',
      phone: '+973 1234 5678',
      email: 'info@yourcompany.com'
    };

    this.quotationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.quotationId) {
      this.loadQuotation();
    } else {
      this.isLoading = false;
    }
  }

  loadQuotation(): void {
    this.isLoading = true;
    this.quotationService.getQuotation(this.quotationId).subscribe({
      next: (res: any) => {
        console.log('Fetched quotation:', res);
        var response = res.body;
        this.quotation = Array.isArray(response) ? response[0] : response;
        this.isLoading = false;
      },
      error: () => {
        this.quotation = null;
        this.isLoading = false;
      }
    });
  }

  getStatusClass(statusId: number): string {
    switch (Number(statusId)) {
      case 0: return 'status-draft';
      case 1: return 'status-pending';
      case 2: return 'status-approved';
      case 3: return 'status-rejected';
      default: return '';
    }
  }

  printQuotation(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/quotations']);
  }
}