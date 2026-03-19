import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnChanges {
  @Input() collapsed = false;
  temporarilyExpanded = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collapsed']) {
      this.temporarilyExpanded = false;
    }
  }

  get isVisuallyCollapsed(): boolean {
    return this.collapsed && !this.temporarilyExpanded;
  }

  onMouseEnter(): void {
    if (this.collapsed) {
      this.temporarilyExpanded = true;
    }
  }

  onMouseLeave(): void {
    if (this.temporarilyExpanded) {
      this.temporarilyExpanded = false;
    }
  }

  navItems: NavItem[] = [
    { label: 'Incident Management', route: '/incident-management', icon: '⚠' },
    { label: 'Admin', route: '/admin', icon: '⚙' }
  ];
}
