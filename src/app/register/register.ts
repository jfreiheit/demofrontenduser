import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {form, FormField, FieldState, required, email, minLength, maxLength, validate, pattern, submit} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { Role } from './role';
import { Auth } from '../auth';

interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
  role: Role;
}

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {

  private readonly auth = inject(Auth);

  registrationSucceeded = signal(false);

  registerModel = signal<RegisterData>({
    username: '',
    email: '',
    password1: '',
    password2: '',
    role: Role.User
  });

  roleOptions: { value: Role; label: string }[] = [
    { value: Role.User, label: 'Nutzer/in' },
    { value: Role.Admin, label: 'Administrator/in' },
  ];

  registerForm = form(this.registerModel,
    (schemaPath) => {
      required(schemaPath.username, {message: 'Nutzername ist erforderlich'});
      pattern(schemaPath.username, /^[a-zA-Z0-9]+$/, {message: 'Nutzername darf nur Buchstaben und Zahlen enthalten'});
      required(schemaPath.email, {message: 'E-Mail ist erforderlich'});
      email(schemaPath.email, {message: 'Bitte eine gültige E-Mail-Adresse eingeben'});
      required(schemaPath.password1, {message: 'Passwort ist erforderlich'});
      required(schemaPath.password2, {message: 'Passwort-Bestätigung ist erforderlich'});
      minLength(schemaPath.password1, 8, {message: 'Passwort muss mindestens 8 Zeichen lang sein'});
      maxLength(schemaPath.password2, 100, {message: 'Passwort ist zu lang'});
      pattern(schemaPath.password1, /(?=.*[A-Za-z])(?=.*\d)/, {message: 'Passwort muss mindestens einen Buchstaben und eine Ziffer enthalten'});

      // Cross-field: password and confirm must match
      validate(schemaPath.password1, ({ valueOf }) => {
        const password = valueOf(schemaPath.password1);
        const confirm = valueOf(schemaPath.password2);
        if (password !== confirm) {
          return { kind: 'mismatch', message: 'Passwörter stimmen nicht überein' };
        }
        return null;
      });
    });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.registerForm, async () => {
      const { username, email, password1, role } = this.registerModel();
      this.auth.register({ username, email, password: password1, role }).subscribe({
        next: () => this.registrationSucceeded.set(true),
        error: (err) => console.error('Registrierung fehlgeschlagen:', err),
      });
    });
  }

  isInvalid(field: FieldState<unknown>): boolean {
    return field.touched() && field.invalid();
  }

  errorMessage(field: FieldState<unknown>): string | undefined {
    return field.errors()[0]?.message;
  }
}
