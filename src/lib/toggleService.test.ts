import { describe, expect, it } from 'vitest';

import { toggleService } from './toggleService';

describe('toggleService', () => {
  it('없으면 추가한다', () => {
    expect(toggleService(['SMALL'], 'HOME')).toEqual(['SMALL', 'HOME']);
  });

  it('있으면 제거한다', () => {
    expect(toggleService(['SMALL', 'HOME'], 'SMALL')).toEqual(['HOME']);
  });
});
