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


  constructor(private http: HttpClient,private router: Router) { }

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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authKey');
  }

 logout(): void {
  localStorage.clear();
  this.router.navigate(['/login']);
}

   


}
