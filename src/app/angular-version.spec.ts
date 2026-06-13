import { VERSION } from '@angular/core';

describe('Angular Version Check', () => {
  it('should be running on Angular 22', () => {
    // Проверяем, что мажорная версия Angular равна 22
    expect(VERSION.major).toBe('22');
  });
});
