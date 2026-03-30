import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
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
