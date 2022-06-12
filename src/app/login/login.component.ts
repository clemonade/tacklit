import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RATE_PATH} from "../app-routing.module";
import {Subject, takeUntil, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form = this.formBuilder.group({
    name: [null, Validators.required]
  })

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    this.authService.setCurrentUser(this.form.get('name')?.value)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(response => response
          ? this.router.navigate([RATE_PATH])
          : this.matSnackBar.open('Login failed.', 'OK'))
      ).subscribe();
  }
}
