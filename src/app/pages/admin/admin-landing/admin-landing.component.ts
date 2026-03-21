import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModuleDTO } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';

interface AdminCard {
  id: string;
  name: string;
  type: 'module' | 'static';
}

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-landing.component.html',
  styleUrl: './admin-landing.component.scss'
})
export class AdminLandingComponent implements OnInit {
  cards: AdminCard[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cards = [{ id: 'users', name: 'Users', type: 'static' }];

    this.adminService.fetchModules().subscribe({
      next: (modules: ModuleDTO[]) => {
        const moduleCards = modules.map(m => ({
          id: String(m.moduleId),
          name: m.moduleName,
          type: 'module' as const
        }));
        this.cards = [...moduleCards, { id: 'users', name: 'Users', type: 'static' }];
      },
      error: (err) => console.error('Failed to load modules:', err)
    });
  }

  viewCard(card: AdminCard): void {
    if (card.type === 'static') {
      this.router.navigate(['/admin', card.id]);
    } else {
      this.router.navigate(['/admin/module', card.id]);
    }
  }
}
