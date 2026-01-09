import { describe, expect, test } from 'vitest';

import { slug } from '../utils/string';

describe('TEST: slug', () => {
  test('Should remove space and lowercase', () => {
    expect(slug('John Doe 123')).toEqual('john-doe-123');
  });

  test('Should remove special characters', () => {
    expect(slug('azerty!^&')).toEqual('azerty');
  });

  test('Should remove accent', () => {
    expect(slug('azértyàè')).toEqual('azertyae');
  });
});
