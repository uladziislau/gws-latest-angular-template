import { describe, it, expect } from 'vitest';
import { VERSION } from '@angular/core';

describe('App Core', () => {
  it('should run on Angular 22 Zoneless', () => {
    expect(VERSION.major).toBe('22');
  });
});
