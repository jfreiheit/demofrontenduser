import { Component, signal } from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';

interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerModel = signal<RegisterData>({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  registerForm = form(this.registerModel);
}
