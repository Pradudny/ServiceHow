import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppModule } from '../../../models/admin.model';
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
    const modules = this.adminService.getModules();
    this.cards = modules.map(m => ({ id: m.id, name: m.name, type: 'module' as const }));
    this.cards.push({ id: 'users', name: 'Users', type: 'static' });
  }

  viewCard(card: AdminCard): void {
    if (card.type === 'static') {
      this.router.navigate(['/admin', card.id]);
    } else {
      this.router.navigate(['/admin/module', card.id]);
    }
  }
}
