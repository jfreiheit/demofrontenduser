import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FieldState, required, submit } from '@angular/forms/signals';

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
      console.log('submitted', this.loginModel());
    });
  }

  isInvalid(field: FieldState<unknown>): boolean {
    return field.touched() && field.invalid();
  }

  errorMessage(field: FieldState<unknown>): string | undefined {
    return field.errors()[0]?.message;
  }
}
