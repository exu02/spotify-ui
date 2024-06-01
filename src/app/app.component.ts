import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSearchComponent } from './user-search/user-search.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserSearchComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'spotify-ui';
}
