export interface EmailValidationResult {
  id?: string;
  email: string;
  is_valid_syntax: boolean;
  is_valid_dns: boolean;
  is_valid_smtp: boolean;
  is_disposable: boolean;
  mx_records: string[];
  validation_message: string;
  created_at?: string;
  details?: {
    syntax: string;
    dns: string;
    smtp: string;
    disposable: string;
  };
}

export interface EmailCheckRequest {
  email: string;
  check_smtp?: boolean;
}

export interface ValidationStats {
  total_validations: number;
  valid_emails: number;
  disposable_emails: number;
  valid_percentage: number;
}

export interface DisposableDomain {
  id: string;
  domain: string;
  added_at: string;
  is_active: boolean;
}
