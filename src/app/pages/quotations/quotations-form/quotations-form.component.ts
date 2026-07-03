import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuotationsService } from '../quotations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../clients/clients.service';

@Component({
  selector: 'app-quotations-form',
  templateUrl: './quotations-form.component.html',
  styleUrls: ['./quotations-form.component.css']
})
export class QuotationsFormComponent {
    QuotationForm!: FormGroup;
    isEditMode = false;
    quotationId = '';
    isLoading = false;
    isSaving = false;
    pageTitle = 'New Quotation';
    clients:any;

    toastMessage = '';
    toastType = 'success';
    showToast = false;
      constructor(
        private fb: FormBuilder,
        private quotationsService: QuotationsService,
        private route: ActivatedRoute,
        private router: Router,
        private clientsService: ClientsService,
        
      ) { }

        ngOnInit(): void {
          this.initForm();
          this.findQuotNumber();
          this.loadClients();

          const id = this.route.snapshot.paramMap.get('id');
          console.log('QuotationFormComponent initialized with ID:', id);
          if (id) {
            this.isEditMode = true;
            this.quotationId = id;
            this.pageTitle = 'Edit Quotation';
            this.loadQuotation(id);
            this.QuotationForm.get('clientid')?.disable();

          } else {
            this.addItem();
          }
          
        }

        findQuotNumber(): void {
          this.quotationsService.getQuotations().subscribe((data:any) => {
            console.log('Fetched quotations for quotnumber:', data);
            if(data && data.body && Array.isArray(data.body)) {
              const quotations = data.body;
              const maxQuotNumber = quotations.reduce((max:any, q:any) => Math.max(max, parseInt(q.quotationnumber, 10)), 0);
              const newQuotNumber = (maxQuotNumber + 1).toString().padStart(4, '0');
              this.QuotationForm.patchValue({ quotnumber: newQuotNumber });
            }
          });
        } 

         loadClients(): void {
            this.isLoading = true;
            this.clientsService.getClients().subscribe((data:any) => {
              console.log('Fetched clients:', data);
              if(data && data.body && Array.isArray(data.body)) {
                this.clients = data.body;
              }
              this.isLoading = false;
            });
          }
          onCompanyChange(event: any): void {
            const selectedClientId = event.target.value;
            console.log('Selected client ID:', selectedClientId);
            console.log('Available clients:', this.clients);
            const selectedClient = this.clients.find((client: any) => client.clientid == selectedClientId);
            console.log('Selected client details:', selectedClient);
            if (selectedClient) {
              this.QuotationForm.patchValue({
                email: selectedClient.email,
                phone: selectedClient.phone
              });
            }
          }

          private initForm(): void {
            this.QuotationForm = this.fb.group({
              quotnumber: ['', [Validators.required, Validators.minLength(2)]],
              clientid: [''],
              email: ['', [Validators.required, Validators.email]],
              phone: [''],
              title: [''],
              quotationDate: [''],
              totalamount: [''],
              status: ['Draft'],
              items: this.fb.array([])
            
            });
          }

          quotations:any;

          private loadQuotation(id: string): void {
            this.isLoading = true;
            this.quotationsService.getQuotation(id).subscribe((data: any) => {
              this.isLoading = false;
              this.quotations = data.body[0];

              if (!this.quotations) {
                this.showNotification('Quotation not found', 'error');
                this.router.navigate(['/quotations']);
                return;
              }
console.log('Fetched quotation data:', this.quotations);
              this.QuotationForm.patchValue({
                quotnumber: this.quotations.quotnumber,
                clientid: this.quotations.clientid,
                email: this.quotations.email,
                phone: this.quotations.phone,
                title: this.quotations.title,
                quotationDate: this.quotations.quotationDate,
                totalamount: this.quotations.totalamount,
                status: this.quotations.status
              });

              // Rebuild items array from fetched data
              this.items.clear();
              if (Array.isArray(this.quotations.items)) {
                this.quotations.items.forEach((item: any) => {
                  const qty = item.quantity || 0;
                  const price = item.unitprice || 0;
                  const computedTotal = item.totalprice ?? (qty * price);

                  this.items.push(this.fb.group({
                    title: [item.title, Validators.required],
                    description: [item.description || ''],
                    quantity: [qty, [Validators.required, Validators.min(1)]],
                    unitprice: [price, [Validators.required, Validators.min(0)]],
                    totalprice: [{ value: computedTotal, disabled: true }]
                  }));
                });
              } else {
                this.addItem();
              }
              this.calculateGrandTotal();
            });
          }

          onSubmit(): void {
              this.QuotationForm.markAllAsTouched();

              if (this.QuotationForm.invalid) {
                return;
              }
              // this.isSaving = true;
              const formData = this.QuotationForm.getRawValue(); // <-- includes disabled controls
              console.log('Submitting form data:', formData, 'Edit mode:', this.isEditMode);

              if (this.isEditMode) {
                this.quotationsService.updateQuotation(this.quotationId, formData).subscribe(updated => {
                  this.isSaving = false;
                  if (updated) {
                    this.showNotification('Quotation updated successfully', 'success');
                    setTimeout(() => this.router.navigate(['/quotations']), 1500);
                  } else {
                    this.showNotification('Failed to update quotation', 'error');
                  }
                });
              } else {
                this.quotationsService.createQuotation(formData).subscribe((data: any) => {
                  this.isSaving = false;
                  console.log('Quotation created:', data);
                  this.showNotification(data.header.return_message, 'success');
                  setTimeout(() => this.router.navigate(['/quotations']), 2000);
                });
              }
            }


          cancel(): void {
            this.router.navigate(['/quotations']);
          }

          // Shortcut for template validation
          get f() {
            return this.QuotationForm.controls;
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

get items(): FormArray {
  return this.QuotationForm.get('items') as FormArray;
}

createItem(): FormGroup {
  return this.fb.group({
    title: ['', Validators.required],
    description: [''],
    quantity: [1, [Validators.required, Validators.min(1)]],
    unitprice: [0, [Validators.required, Validators.min(0)]],
    totalprice: [{ value: 0, disabled: true }]
  });
}

addItem(): void {
  this.items.push(this.createItem());
}

removeItem(index: number): void {
  this.items.removeAt(index);
}

calculateItemTotal(index: number): void {
  const item = this.items.at(index);
  const qty = item.get('quantity')?.value || 0;
  const price = item.get('unitprice')?.value || 0;

  const total = qty * price;
  item.get('totalprice')?.setValue(total, { emitEvent: false });

  this.calculateGrandTotal();
}

calculateGrandTotal(): void {
  let total = 0;

  this.items.controls.forEach((ctrl:any) => {
    const val = ctrl.get('totalprice')?.value || 0;
    total += val;
  });

  this.QuotationForm.get('totalamount')?.setValue(total);
}

}
