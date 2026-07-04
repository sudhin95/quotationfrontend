import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AiLogsService } from '../ai-logs.service';

@Component({
  selector: 'app-ai-logs-list',
  templateUrl: './ai-logs-list.component.html',
  styleUrls: ['./ai-logs-list.component.css']
})
export class AiLogsListComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  searchTerm = '';
  isLoading = false;

  showDrawer = false;
  selectedLog: any | null = null;
  formattedResponse = '';

  constructor(private aiLogService: AiLogsService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    // Replace with your actual service call
    this.aiLogService.getLogs().subscribe((data:any) => {
      this.logs = data.body;
      this.filteredLogs = data.body;
      this.isLoading = false;
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredLogs = !term
      ? this.logs
      : this.logs.filter(log =>
          (log.request || '').toLowerCase().includes(term)
        );
  }

  getResponsePreview(response: string): string {
    if (!response) return '—';
    try {
      const parsed = JSON.parse(response);
      const flat = JSON.stringify(parsed);
      return flat.length > 60 ? flat.substring(0, 60) + '...' : flat;
    } catch {
      return response.length > 60 ? response.substring(0, 60) + '...' : response;
    }
  }

  openDrawer(log: any): void {
    this.selectedLog = log;
    try {
      const parsed = JSON.parse(log.response);
      this.formattedResponse = JSON.stringify(parsed, null, 2);
    } catch {
      this.formattedResponse = log.response || 'No response data';
    }
    this.showDrawer = true;
  }

  closeDrawer(): void {
    this.showDrawer = false;
    this.selectedLog = null;
    this.formattedResponse = '';
  }
}