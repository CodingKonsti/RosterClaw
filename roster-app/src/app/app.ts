import { Component, ViewChild, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="drawer.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="app-title">{{ isMobile ? 'Duty Roster' : 'Duty Roster Planning' }}</span>
    </mat-toolbar>

    <mat-drawer-container class="app-container">
      <mat-drawer #drawer [mode]="drawerMode" [opened]="drawerOpened" class="app-sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/roster" routerLinkActive="active-link" (click)="onNavClick()">
            <mat-icon matListItemIcon>calendar_month</mat-icon>
            <span matListItemTitle>Roster</span>
          </a>
          <a mat-list-item routerLink="/employees" routerLinkActive="active-link" (click)="onNavClick()">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Employees</span>
          </a>
          <a mat-list-item routerLink="/shift-types" routerLinkActive="active-link" (click)="onNavClick()">
            <mat-icon matListItemIcon>schedule</mat-icon>
            <span matListItemTitle>Shift Types</span>
          </a>
        </mat-nav-list>
      </mat-drawer>

      <mat-drawer-content class="app-content">
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .app-title {
      margin-left: 16px;
      font-size: 20px;
      font-weight: 500;
    }

    .app-container {
      height: calc(100vh - 64px);
    }

    .app-sidenav {
      width: 250px;
    }

    .app-content {
      background-color: #f5f5f5;
    }

    .active-link {
      background-color: rgba(0, 0, 0, 0.04);
    }

    mat-nav-list a {
      margin: 4px 8px;
      border-radius: 4px;
    }

    mat-nav-list a:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    /* Mobile responsive adjustments */
    @media (max-width: 768px) {
      .app-toolbar {
        height: 56px;
      }

      .app-container {
        height: calc(100vh - 56px);
      }

      .app-title {
        font-size: 18px;
        margin-left: 8px;
      }
    }
  `]
})
export class AppComponent {
  private breakpointObserver = inject(BreakpointObserver);

  @ViewChild('drawer') drawer!: MatDrawer;
  title = 'Duty Roster Planning';
  isMobile = false;
  drawerMode: 'side' | 'over' = 'side';
  drawerOpened = true;

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.drawerMode = result.matches ? 'over' : 'side';
        this.drawerOpened = !result.matches;
      });
  }

  onNavClick(): void {
    // Close drawer on mobile after navigation
    if (this.isMobile) {
      this.drawer.close();
    }
  }
}
