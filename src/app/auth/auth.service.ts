import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Hardcoded test user credentials
  // private readonly TEST_EMAIL = 'admin@example.com';
  // private readonly TEST_PASSWORD = 'password123';
  // private readonly STORAGE_KEY = 'qb_auth_token';
  // private readonly USER_KEY = 'qb_user';

  // Test user profile
    // private readonly testUser: User = {
    //   id: '1',
    //   name: 'Admin User',
    //   email: this.TEST_EMAIL
    // };



  constructor(private http: HttpClient) { }

  getLogin(username:any,password:any): Observable<Array<any>> {
    console.log('getLogin called with username:', username, 'and password:', password);
    const params = new HttpParams({
      fromObject: {
        username: username,
        password: password      
      },
    });
    const postUrl = environment.apiUrl + environment.loginApiUrl +"/login";
    let httpHeaders = new HttpHeaders({});
    return this.http.post<Array<any>>(postUrl, params, {
      headers: httpHeaders,
    });
  }




}
