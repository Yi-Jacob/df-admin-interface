import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DFManageTableComponent } from 'src/app/shared/components/df-manage-table/df-manage-table.component';
import { AdminType, UserRow } from 'src/app/shared/types/user';
import { DfAdminService } from '../services/df-admin.service';
import { takeUntil } from 'rxjs';
import {
  faCheckCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'df-manage-admins',
  templateUrl: './df-manage-admins.component.html',
  styleUrls: [
    '../../shared/components/df-manage-table/df-manage-table.component.scss',
  ],
})
export class DfManageAdminsComponent extends DFManageTableComponent<UserRow> {
  constructor(
    private adminService: DfAdminService,
    router: Router,
    activatedRoute: ActivatedRoute,
    liveAnnouncer: LiveAnnouncer
  ) {
    super(router, activatedRoute, liveAnnouncer);
  }
  override columns = [
    {
      columnDef: 'select',
    },
    {
      columnDef: 'active',
      cell: (row: UserRow) => `${row.active}`,
      header: 'active',
      sortActionDescription: 'active',
    },
    {
      columnDef: 'id',
      cell: (row: UserRow) => `${row.id}`,
      header: 'id',
      sortActionDescription: 'id',
    },
    {
      columnDef: 'email',
      cell: (row: UserRow) => `${row.email}`,
      header: 'email',
      sortActionDescription: 'email',
    },
    {
      columnDef: 'displayName',
      cell: (row: UserRow) => `${row.displayName}`,
      header: 'name',
      sortActionDescription: 'displayName',
    },
    {
      columnDef: 'firstName',
      cell: (row: UserRow) => `${row.firstName}`,
      header: 'firstName',
      sortActionDescription: 'firstName',
    },
    {
      columnDef: 'lastName',
      cell: (row: UserRow) => `${row.lastName}`,
      header: 'lastName',
      sortActionDescription: 'lastName',
    },
    {
      columnDef: 'registration',
      cell: (row: UserRow) => `${row.registration}`,
      header: 'registration',
      sortActionDescription: 'registration',
    },
  ];

  activeIcon(active: boolean): IconProp {
    return active ? faCheckCircle : faXmarkCircle;
  }

  mapDataToTable(data: any): UserRow[] {
    return data.map((user: AdminType) => {
      return {
        id: user.id,
        email: user.email,
        displayName: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        registration: user.confirmed,
        active: user.isActive,
      };
    });
  }

  deleteRow(row: UserRow): void {
    this.adminService
      .deleteAdmin(row.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.refreshTable();
      });
  }

  refreshTable(limit?: number, offset?: number): void {
    console.log(limit, offset);
    this.adminService
      .getAdmins(limit, offset)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.dataSource.data = this.mapDataToTable(data.resource);
        this.tableLength = data.meta.count;
      });
  }
}