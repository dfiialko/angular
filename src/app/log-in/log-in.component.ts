import { ValidatorService } from './../../shared/form_validation/validator.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [DataService, ValidatorService]
})

export class LogInComponent implements OnInit {

  loggedIn = false;
  token: Array<{access_token: string}> = [];
  authorization_token: string;
  authenticated: boolean;
  showhide = true;
  errorMessage: string;
  @ViewChild('email') emailRef: ElementRef;
  @ViewChild('password') passwordRef: ElementRef;
  @ViewChild('spinner') spinner: ElementRef;
  @Output() signInEmitter = new EventEmitter<any>();
  @Output() homePageEmitter = new EventEmitter<any>();
  @Output() resetPasswordEmitter = new EventEmitter<any>();
  @Output() userNameEmitter = new EventEmitter<any>();

  constructor(private _dataService: DataService, private _validator: ValidatorService) { }
  ngOnInit() { }

  /* Triggered when JSON request returns success
     Saves token in the Local Storage
     Gives access to the token */
  login_attempt(attempt) {
    this.authenticated = attempt;
    this.showhide = true;
    if (attempt) {
      localStorage.setItem('auth_token', this.token[0].access_token);
      this.homePageEmitter.emit('homePage');
      this.authorization_token = localStorage.getItem('auth_token');
    }else {
      this.authenticated = false;
    }
  }
  // Happens when Login button clicked
  logInClick() {
    this.showhide = false;
    const username = this.emailRef.nativeElement.value;
    const password = this.passwordRef.nativeElement.value;
    console.log('log in clicked');
    const login_data = {
  //login data goes here
    };
    // Validate input
    if (this._validator.validateInput(username) && this._validator.validateInput(password)) {
    // Use service to send login request
    this._dataService.logIn(login_data).subscribe(
      data => this.token.push(data),
      error => {this.errorMessage = 'Email or password is incorrect'; this.login_attempt(false); },
      () => { this.authenticated = true;
              this.login_attempt(true); });
     }else {
       this.authenticated = false;
       this.errorMessage = this._validator.errorMessage;
     }
}

  // Triggers when the password reset link was clicked
  resetPasswordClicked() {
    console.log('reset password clicked');
    this.resetPasswordEmitter.emit('passwordPage');
  }
}
