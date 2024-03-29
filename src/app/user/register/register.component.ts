import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RegistrationValidators } from '../validators/registration-validators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  inSubmission = false;

  constructor(private auth: AuthService) {}

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [
    Validators.required,
     Validators.email
    ]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13),
  ]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    password: this.password,
    confirm_password: this.confirm_password,
    age: this.age,
    phoneNumber: this.phoneNumber,
  },RegistrationValidators.match('password', 'confirm_password'));

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created';
  alertColor = 'blue';

  async register() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created';
    this.alertColor = 'blue';

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (e) {
      /*
      One of tha ways to validate email for duplication was to asynchronously validate 
      using 'fetchSignInMethodsForEmail' method available under AngularFireAuth service
      But as of 15 Sep 2023, email enumeration protection is enabled by default on Google Cloud platform
      As a result, the client SDK method 'fetchSignInMethodsForEmail' is deprecated
      Another option is to validate against entries in the firebase database but that being a costly operation,
      need to re-consider on the same.
      As of now we are validating the same against the error response in order 
      to display appropriate error messages to the user, but this ofcourse is only a temp solution 
      Reference: https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection
      */
      this.isDuplicateEmail(e);
      console.log(JSON.stringify(e));
      return;
    }

    this.alertMsg = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }

  isDuplicateEmail(e: any){
    if(JSON.stringify(e).includes("EMAIL_EXISTS")){
      this.registerForm.controls.email.setErrors({emailExists: true});
      this.alertMsg = 'Account creation failed. Please verify inputs and try again.';
    }
    else{
      this.alertMsg = 'An unexpected error occured. Please try again later.';
    }
    this.inSubmission = false;
    this.alertColor = 'red';
  }
}