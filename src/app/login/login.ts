import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, FieldState, required, submit } from '@angular/forms/signals';
import { Auth } from '../auth';

interface LoginData {
  usernameOrEmail: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {

  private readonly auth = inject(Auth);

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
    submit(this.loginForm, async () => {
      this.auth.login(this.loginModel()).subscribe({
        next: (result) => console.log('Angemeldet als', result.username),
        error: (err) => console.error('Anmeldung fehlgeschlagen:', err),
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
