import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {form, FormField, FieldState, required, email, minLength, maxLength, validate, pattern, submit} from '@angular/forms/signals';

interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

@Component({
  selector: 'app-register',
  imports: [FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {

  registerModel = signal<RegisterData>({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

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
    console.log('submitted')
    submit(this.registerForm, async () => {
      const credentials = this.registerModel();
      // In a real app, this would be async:
      // await this.authService.login(credentials);
      console.log('Logging in with:', credentials);
    });
  }

  isInvalid(field: FieldState<unknown>): boolean {
    return field.touched() && field.invalid();
  }

  errorMessage(field: FieldState<unknown>): string | undefined {
    return field.errors()[0]?.message;
  }
}
