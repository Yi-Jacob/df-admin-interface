export interface GenericSuccessResponse {
  success: boolean;
}

export interface GenericErrorResponse {
  error: {
    code: string;
    context:
      | string
      | { error: Array<any>; resource: Array<GenericErrorResponse> };
    message: string;
    status_code: number;
  };
}

export interface Meta {
  count: number;
}

export interface GenericListResponse<T> {
  resource: Array<T>;
  meta: Meta;
}

export interface KeyValuePair {
  key: string;
  value: any;
}
export interface RequestOptions {
  showSpinner: boolean;
  filter: string;
  sort: string;
  fields: string;
  related: string;
  limit: number;
  offset: number;
  includeCount: boolean;
  snackbarSuccess: string;
  snackbarError: string;
  contentType: string;
  additionalParams: KeyValuePair[];
  additionalHeaders: KeyValuePair[];
  includeCacheControl: boolean;
  refresh: boolean;
}

export type GenericCreateResponse = GenericListResponse<{ id: number }>;
export interface GenericUpdateResponse {
  id: number;
}
