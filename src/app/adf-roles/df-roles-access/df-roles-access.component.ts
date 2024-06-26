import { Component, Inject, OnInit, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponseObj } from '../../shared/types/roles';
import { TranslocoPipe } from '@ngneat/transloco';
import { BASE_SERVICE_TOKEN } from 'src/app/shared/constants/tokens';
import { DfBaseCrudService } from 'src/app/shared/services/df-base-crud.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'df-roles-access',
  templateUrl: './df-roles-access.component.html',
  styleUrls: ['./df-roles-access.component.scss'],
  standalone: true,
  imports: [
    TranslocoPipe,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    FontAwesomeModule,
    MatButtonModule,
    AsyncPipe,
    CommonModule,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '*', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DfRolesAccessComponent implements OnInit {
  @Input() formArray: FormArray;
  @Input() roleForm: FormGroup;
  rootForm: FormGroup;
  serviceAccess: FormArray;
  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    'service',
    'component',
    'access',
    'requester',
    'advancedFilters',
    'actions',
  ];
  expandField: FormControl = new FormControl('');
  faTrashCan = faTrashCan;
  faPlus = faPlus;
  serviceOptions = [{ id: 0, name: '' }];
  expandOperator: FormControl = new FormControl('');
  expandValue: FormControl = new FormControl('');

  componentOptions: ComponentOption[] = [{ serviceId: 0, components: ['*'] }];

  accessOptions = [
    { value: 1, label: 'GET (read)' },
    { value: 2, label: 'POST (create)' },
    { value: 4, label: 'PUT (replace)' },
    { value: 8, label: 'PATCH (update)' },
    { value: 16, label: 'DELETE (remove)' },
  ];

  requesterOptions = [
    { value: 1, label: 'API' },
    { value: 2, label: 'SCRIPT' },
  ];

  operatorOptions = [
    { value: '=', label: '=' },
    { value: '!=', label: '!=' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: 'in', label: 'in' },
    { value: 'not in', label: 'not in' },
    { value: 'start with', label: 'start with' },
    { value: 'end with', label: 'end with' },
    { value: 'contains', label: 'contains' },
    { value: 'is null', label: 'is null' },
    { value: 'is not null', label: 'is not null' },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(BASE_SERVICE_TOKEN)
    private baseService: DfBaseCrudService
  ) {}

  ngOnInit() {
    // get services options
    this.activatedRoute.data.subscribe((data: any) => {
      // sort service options by name
      this.serviceOptions =
        data?.services?.resource.sort(
          (a: ServiceResponseObj, b: ServiceResponseObj) => {
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          }
        ) || [];

      // if service ID exists, GET service components
      if (
        data.type === 'edit' &&
        data.data.roleServiceAccessByRoleId.length > 0
      ) {
        data.data.roleServiceAccessByRoleId.forEach((item: any) => {
          const serviceId = item.serviceId;
          const serviceName =
            this.serviceOptions.find(service => service.id === serviceId)
              ?.name || '';

          // "GET requests without a resource are not currently supported by the 'email' service."
          if (serviceName === 'email') {
            this.componentOptions.push({ serviceId, components: ['*'] });
            return;
          }

          // GET Components for service
          this.baseService
            .get(serviceName, {
              additionalParams: [{ key: 'as_access_list', value: true }],
            })
            .subscribe((response: any) => {
              const components = response.resource;
              this.componentOptions.push({ serviceId, components });
            });
        });
      }
    });

    this.updateDataSource();
  }

  async getComponents(index: number) {
    const serviceId = this.formArray.controls[index].get('service')?.value;
    const service =
      this.serviceOptions.find(service => service.id === serviceId)?.name || '';

    // "GET requests without a resource are not currently supported by the 'email' service."
    if (service === 'email') {
      this.componentOptions.push({ serviceId, components: ['*'] });
      return;
    }

    if (
      !this.componentOptions.some(
        (option: ComponentOption) => option.serviceId === serviceId
      )
    ) {
      this.baseService
        .get(service, {
          additionalParams: [{ key: 'as_access_list', value: true }],
        })
        .subscribe((data: any) => {
          this.componentOptions.push({
            serviceId,
            components: data.resource,
          });
        });
    }
  }

  getComponentArray(index: number) {
    const serviceId = this.formArray.at(index).get('service')?.value;
    const components = this.componentOptions.find(
      option => option.serviceId === serviceId
    )?.components;
    return components || [];
  }

  getExtendOperator(index: number) {
    const serviceId = this.serviceAccess.at(index).get('extend-operator')
      ?.value;
    const operators = this.componentOptions.find(
      option => option.serviceId === serviceId
    )?.components;
    return operators || [];
  }

  expandedElement$ = new BehaviorSubject<number | 1>(1);
  expandedElement: number | null = null;
  toggleRow(element: any, index: number) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      if (this.getAdvancedFilters(index).length === 0) {
        this.addAdvancedFilter(index);
      }
    }
  }

  accessChange(index: number, value: number[]) {
    const access = this.formArray.at(index).get('access');
  }

  updateDataSource() {
    if (!this.formArray) return;
    this.dataSource = new MatTableDataSource(this.formArray.controls);
  }

  get hasServiceAccess() {
    return this.rootForm.controls['serviceAccess'].value.length > 0;
  }

  add(): void {
    const advancedFilters = new FormArray([]);

    this.formArray.push(
      new FormGroup({
        service: new FormControl(0, Validators.required),
        component: new FormControl('', Validators.required),
        access: new FormControl('', Validators.required),
        requester: new FormControl([1], Validators.required),
        advancedFilters: advancedFilters,
        id: new FormControl(null),
      })
    );

    this.updateDataSource();
  }

  getAdvancedFilters(index: number): FormArray {
    return this.formArray.controls[index].get('advancedFilters') as FormArray;
  }

  addAdvancedFilter(index: number) {
    const advancedFilters = this.getAdvancedFilters(index);
    advancedFilters.push(
      new FormGroup({
        expandField: new FormControl('', Validators.required),
        expandOperator: new FormControl('', Validators.required),
        expandValue: new FormControl('', Validators.required),
      })
    );
    this.updateDataSource();
  }

  removeAdvancedFilter(serviceAccessIdx: number, filterIdx: number) {
    this.getAdvancedFilters(serviceAccessIdx).removeAt(filterIdx);
    if (this.getAdvancedFilters(serviceAccessIdx).length === 0) {
      this.expandedElement = null;
    }
    this.updateDataSource();
  }

  remove(index: number) {
    this.formArray.removeAt(index);
    this.updateDataSource();
  }

  addFilter(index: number) {
    const filters = this.serviceAccess
      .at(index)
      .get('advancedFilters') as FormArray;
    if (filters instanceof FormArray) {
      filters.push(
        new FormGroup({
          expandField: new FormControl('', Validators.required),
          expandOperator: new FormControl('', Validators.required),
          expandValue: new FormControl('', Validators.required),
        })
      );
    } else {
      console.error('advancedFilters is not a FormArray');
    }
  }

  removeFilter(serviceIndex: number, filterIndex: number) {
    const filters = this.serviceAccess
      .at(serviceIndex)
      .get('advancedFilters') as FormArray;
    filters.removeAt(filterIndex);
  }
}

interface ComponentOption {
  serviceId: number;
  components: string[];
}
