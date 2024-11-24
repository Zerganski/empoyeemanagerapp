import { Injectable } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly tokenKey = 'authToken'; 

    constructor(
        private userService: UserService
    ) { }

    saveToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }
    
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
   
    login(user: User) {
        return this.userService.login(user); 
    }

    isAdmin(): boolean {
        const token = this.getToken(); 
        if (token) {
            const decodedToken = this.userService.decodeJwt(token);
            return decodedToken?.role === 'ADMIN';  
        }
        return false;
    }
   
    getUserRole(): string | null {
        return this.userService.getUserRole(); 
    }

    logout(): void {
        this.userService.logout(); 
    }

    checkTokenOnPageLoad(): boolean {
        return this.userService.checkTokenOnPageLoad(); 
    }
}



