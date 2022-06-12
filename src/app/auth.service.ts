import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
  }

  setCurrentUser(name: string): Observable<boolean> {
    this.currentUser.next(name)
    return of(true);
  }

  getCurrentUser(): Observable<string> {
    return this.currentUser.asObservable();
  }
}
