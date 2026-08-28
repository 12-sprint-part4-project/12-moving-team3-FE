import { describe, expect, it } from 'vitest';

import { resources } from './resources';

type ResourceValue = string | { [key: string]: ResourceValue };

const collectLeafKeys = (value: ResourceValue, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return typeof child === 'object' && child !== null
      ? collectLeafKeys(child, path)
      : [path];
  });

const getLeafValue = (resource: ResourceValue, path: string) =>
  path.split('.').reduce<ResourceValue>((value, segment) => {
    if (typeof value !== 'object' || value === null) {
      return '';
    }

    return value[segment] ?? '';
  }, resource);

describe('i18n resources', () => {
  it('모든 언어 리소스가 한국어와 동일한 번역 키를 제공한다', () => {
    const expectedKeys = collectLeafKeys(resources.ko.common).sort();

    expect(collectLeafKeys(resources.en.common).sort()).toEqual(expectedKeys);
    expect(collectLeafKeys(resources['zh-CN'].common).sort()).toEqual(
      expectedKeys
    );
  });

  it('모든 번역 문구가 비어 있지 않다', () => {
    const locales = [
      resources.ko.common,
      resources.en.common,
      resources['zh-CN'].common,
    ];

    locales.forEach((resource) => {
      const values = collectLeafKeys(resource).map((key) =>
        getLeafValue(resource, key)
      );

      expect(
        values.every((value) => typeof value === 'string' && value.trim())
      ).toBe(true);
    });
  });
});
