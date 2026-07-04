import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class AiLogsService {

  constructor(private http: HttpClient) { }

  getLogs(): Observable<Array<any>> {
    var sessionId = localStorage.getItem('authKey');
    var userId = localStorage.getItem('userId');
    const postUrl =
      environment.apiUrl + environment.aiLogsApiUrl + '/';
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    });
    return this.http.get<Array<any>>(postUrl, { headers: httpHeaders });
  }
}
