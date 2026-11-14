import { ErrorHandler, Injectable, signal } from '@angular/core';

export interface AppError {
  message: string;
  timestamp: number;
  error?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  readonly errors = signal<AppError[]>([]);

  handleError(error: unknown): void {
    console.error('Global error:', error);

    const message = error instanceof Error ? error.message : String(error);

    this.errors.update(errors => [...errors.slice(-4), { message, timestamp: Date.now(), error }]);

    if (error instanceof Error && error.stack?.includes('NG0')) {
      console.warn('Angular error detected, component may have crashed');
    }
  }

  clearErrors(): void {
    this.errors.set([]);
  }

  dismissError(index: number): void {
    this.errors.update(errors => errors.filter((_, i) => i !== index));
  }
}
