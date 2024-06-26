import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@ngneat/transloco';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DfThemeService } from '../../services/df-theme.service';
import { AsyncPipe } from '@angular/common';
@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'df-profile-details',
  templateUrl: './df-profile-details.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoPipe,
    NgIf,
    AsyncPipe,
  ],
})
export class DfProfileDetailsComponent implements OnInit {
  rootForm: FormGroup;
  constructor(
    private rootFormGroup: FormGroupDirective,
    private themeService: DfThemeService
  ) {}
  isDarkMode = this.themeService.darkMode$;

  ngOnInit() {
    this.rootForm = this.rootFormGroup.control;
    this.rootFormGroup.ngSubmit.subscribe(() => {
      this.rootForm.markAllAsTouched();
    });
  }

  controlExists(control: string): boolean {
    return this.rootForm.get(control) !== null;
  }

  isRequired(control: string): boolean {
    return !!this.rootForm.get(control)?.hasValidator(Validators.required);
  }
}
