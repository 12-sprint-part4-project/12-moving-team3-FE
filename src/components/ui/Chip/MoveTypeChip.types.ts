import { createElement } from 'react';

import { MoveTypeChip } from './MoveTypeChip';

/** furnitureShare는 size="xs"를 허용하지 않는다 */
// @ts-expect-error furnitureShare는 xs 사이즈를 허용하지 않는다
void createElement(MoveTypeChip, { type: 'furnitureShare', size: 'xs' });

void createElement(MoveTypeChip, { type: 'furnitureShare', size: 'sm' });
void createElement(MoveTypeChip, { type: 'small', size: 'xs' });
