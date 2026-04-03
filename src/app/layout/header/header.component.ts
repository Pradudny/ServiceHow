import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  appName = 'ServiceHow';

  @Output() toggleSideNav = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onToggleSideNav(): void {
    this.toggleSideNav.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
