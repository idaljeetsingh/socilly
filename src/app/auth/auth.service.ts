import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';


@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private API_BASE_URL = environment.API_BASE_URL;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: number | undefined;
  private loggedInUser: string;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(name: string, email: string, password: string) {
    const authData: AuthData = {name, email, password};
    this.http.post(`${this.API_BASE_URL}/user/signup`, authData)
      .subscribe(response => {
        console.log(response);
      }, error => {
        this.authStatusListener.next(false);
      });
    this.router.navigate(['/']);
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  getUserId() {
    return this.userId;
  }

  login(email: string, password: string) {
    const authData = {email, password};
    this.http.post<{ token: string, expiresIn: number, name: string, userId: string }>(`${this.API_BASE_URL}/user/login`, authData)
      .subscribe(response => {
        // console.log(response);
        this.token = response.token;
        if (this.token) {
          const expiresIn = response.expiresIn;
          this.setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.loggedInUser = response.name;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate, this.loggedInUser, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation._token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.loggedInUser = authInformation._name;
      this.userId = authInformation.userId;
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, name: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('name', name);
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      _token: token,
      expirationDate: new Date(expirationDate),
      _name: name,
      userId: userId
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
