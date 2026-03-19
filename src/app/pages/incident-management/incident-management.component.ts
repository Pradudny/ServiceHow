import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-incident-management',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './incident-management.component.html',
  styleUrl: './incident-management.component.scss'
})
export class IncidentManagementComponent {
}
