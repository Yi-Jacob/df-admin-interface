import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdfAppsRoutingModule } from './adf-apps-routing.module';
import { DfManageAppsComponent } from './df-manage-apps/df-manage-apps.component';
import { DfAppDetailsComponent } from './df-app-details/df-app-details.component';
import { DfImportAppComponent } from './df-import-app/df-import-app.component';
import { DfManageAppsTableComponent } from './df-manage-apps/df-manage-apps-table.component';
import { DfAppsService } from './services/df-apps.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    DfManageAppsComponent,
    DfManageAppsTableComponent,
    DfAppDetailsComponent,
    DfImportAppComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdfAppsRoutingModule,
    FontAwesomeModule,
    TranslateModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  providers: [DfAppsService],
})
export class AdfAppsModule {}
