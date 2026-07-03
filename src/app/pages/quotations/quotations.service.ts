import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class QuotationsService {

  constructor(private http: HttpClient) { }

  getQuotations(): Observable<Array<any>> {
    var sessionId = localStorage.getItem('authKey');
    var userId = localStorage.getItem('userId');
    const postUrl =
      environment.apiUrl +environment.quotationsApiUrl + '/';
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    });
    return this.http.get<Array<any>>(postUrl, { headers: httpHeaders });
  }

  deleteQuotation(id: any): Observable<Array<any>> {
    var sessionId = localStorage.getItem('authKey');
    var userId = localStorage.getItem('userId');
    const postUrl = environment.apiUrl + environment.quotationsApiUrl;
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    });
    return this.http.delete<Array<any>>(postUrl + '/' + id, {
      headers: httpHeaders,
    });
  }

  getQuotation(id: string): Observable<Array<any>> {
    var sessionId = localStorage.getItem('authKey');
    var userId = localStorage.getItem('userId');
    const postUrl =
      environment.apiUrl +environment.quotationsApiUrl + '/' + id;
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    });
    return this.http.get<Array<any>>(postUrl, { headers: httpHeaders });
  }

  updateQuotation(quotationId: any, quotationData: any): Observable<Array<any>> {
    var sessionId = localStorage.getItem('authKey');
    var userId = localStorage.getItem('userId');
  
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    });
    const postUrl = environment.apiUrl + environment.quotationsApiUrl;
    return this.http.put<Array<any>>(postUrl + '/' + quotationId, quotationData, {
      headers: httpHeaders,
    });
  }

  
  createQuotation(quotationData: any): Observable<Array<any>> {
  
    var sessionId = localStorage.getItem('authKey');
    var userId = localStorage.getItem('userId');
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    });
    const postUrl = environment.apiUrl + environment.quotationsApiUrl;
    return this.http.post<Array<any>>(postUrl, quotationData, {
      headers: httpHeaders,
    });
  }




}
