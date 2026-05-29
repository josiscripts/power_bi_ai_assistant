import { describe, it, expect } from 'vitest';
import {
  truncateText,
  capitalize,
  slugify,
  arrayToString,
  debounce,
  throttle,
  isEmptyObject,
  mergeObjects,
  pickProperties,
  omitProperties,
} from '@utils/helpers';

describe('Helper Functions', () => {
  describe('truncateText', () => {
    it('debe truncar texto largo', () => {
      const text = 'Este es un texto muy largo que necesita ser truncado';
      const result = truncateText(text, 20);
      expect(result).toHaveLength(23); // 20 + "..."
      expect(result).toContain('...');
    });

    it('no debe truncar texto corto', () => {
      const text = 'Corto';
      const result = truncateText(text, 20);
      expect(result).toBe('Corto');
    });
  });

  describe('capitalize', () => {
    it('debe capitalizar correctamente', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
    });
  });

  describe('slugify', () => {
    it('debe convertir a slug válido', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test Slug')).toBe('test-slug');
    });

    it('debe remover caracteres especiales', () => {
      expect(slugify('Test @#$ Slug')).toBe('test-slug');
    });
  });

  describe('arrayToString', () => {
    it('debe convertir array a string', () => {
      expect(arrayToString(['a', 'b', 'c'])).toBe('a, b, c');
    });

    it('debe usar separador personalizado', () => {
      expect(arrayToString(['a', 'b', 'c'], ' | ')).toBe('a | b | c');
    });
  });

  describe('debounce', () => {
    it('debe crear una función debounceada', (done) => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe('isEmptyObject', () => {
    it('debe detectar objetos vacíos', () => {
      expect(isEmptyObject({})).toBe(true);
      expect(isEmptyObject({ key: 'value' })).toBe(false);
    });
  });

  describe('mergeObjects', () => {
    it('debe combinar objetos', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = mergeObjects(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('pickProperties', () => {
    it('debe seleccionar propiedades específicas', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pickProperties(obj, ['a', 'c']);

      expect(result).toEqual({ a: 1, c: 3 });
      expect(result).not.toHaveProperty('b');
    });
  });

  describe('omitProperties', () => {
    it('debe omitir propiedades específicas', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omitProperties(obj, ['b']);

      expect(result).toEqual({ a: 1, c: 3 });
      expect(result).not.toHaveProperty('b');
    });
  });
});
