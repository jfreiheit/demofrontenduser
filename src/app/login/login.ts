import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, FieldState, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { Auth } from '../auth';

interface LoginData {
  usernameOrEmail: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {

  private readonly auth = inject(Auth);

  loggedInAs = signal<string | null>(null);
  serverError = signal<string | null>(null);

  loginModel = signal<LoginData>({
    usernameOrEmail: '',
    password: '',
  });

  loginForm = form(this.loginModel,
    (schemaPath) => {
      required(schemaPath.usernameOrEmail, {message: 'Nutzername oder E-Mail ist erforderlich'});
      required(schemaPath.password, {message: 'Passwort ist erforderlich'});
    });

  onSubmit(event: Event) {
    event.preventDefault();
    this.serverError.set(null);
    submit(this.loginForm, async () => {
      this.auth.login(this.loginModel()).subscribe({
        next: (result) => this.loggedInAs.set(result.username),
        error: (err) => this.serverError.set(err.error?.message ?? 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.'),
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
