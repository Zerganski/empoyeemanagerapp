import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { enviroment } from '../environments/enviroment';
import { User } from './user';


@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiServerUrl = enviroment.apiBaseUrl; 
    private readonly tokenKey = 'authToken'; 

    constructor(private http: HttpClient) { }

    login(user: User): Observable<{ accessToken: string }> {
        return this.http.post<{ accessToken: string }>(`${this.apiServerUrl}/api/auth/login`, user).pipe(
            tap(response => {
                const token = response.accessToken;
                if (token) {
                    localStorage.setItem('authToken', token);
                    try {
                        const decodedToken = this.decodeJwt(token); 
                        console.log(decodedToken);
                        localStorage.setItem('userRole', decodedToken?.roles); 
                        localStorage.setItem('username', decodedToken?.sub); 
                    } catch (error) {
                        console.error('Error decoding token', error);
                    }
                } else {
                    console.error('Received empty token', response);
                }
            }),
            catchError(error => {
                console.error('Login failed:', error);
                return throwError(error);
            })
        );
    }

    decodeJwt(token: string): any {
        try {
            const decoded = jwt_decode(token);
            console.log('Decoded JWT:', decoded);
            return decoded; 
        } catch (error) {
            console.error('Error decoding token', error);
            return null;
        }
    }

    isTokenExpired(token: string): boolean {
        try {
            const decodedToken: any = jwt_decode(token); 
            const expirationDate = decodedToken.exp * 1000; 
            return expirationDate < Date.now();
        } catch (error) {
            return true; 
        }
    }

    checkTokenOnPageLoad(): boolean {
        const token = this.getToken();
        if (!token || this.isTokenExpired(token)) {
            this.logout();
            return false;
        }
        return true;
    }

    saveToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }
   
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
    }

    getUserRole(): string | null {
        return localStorage.getItem('userRole');
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
    }

    isAdmin(): boolean {
        return this.getUserRole() === 'ADMIN'; 
    }
}
