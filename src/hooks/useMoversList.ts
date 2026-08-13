import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { moverQueryKeys } from '@/constants/queryKey';
import { getMovers, toMoverCardModelFromListItem } from '@/services/moversApi';
import type {
  ApiMoveType,
  ApiRegion,
  MoversListParams,
  MoversSortValue,
} from '@/types/mover';
import { SORT_VALUE_TO_API } from '@/types/mover';

/** 필터 배열을 정렬해 queryKey·요청 파라미터를 안정화 */
// 동일한 값의 배열이라도, 항상 같은 순서로 만들어지도록 해주는 제네릭 함수
// React Query의 queryKey 같은 곳에서 "참조 안정성"과 "일관된 캐싱"을 위해 사용
const toStableOptions = <T extends string>(items: readonly T[]): T[] =>
  [...items].sort(); //알파벳 순으로 정렬. (얕은 복사?)
//readOnly T[] : 배열의 불변성을 보장하기 위해 사용함. (말그대로 읽기만 가능)

//MoversListParams랑 비슷하나 조금 다름. 왜일까?
export interface UseMoversListParams {
  keyword?: string;
  regions?: ApiRegion[];
  moveTypes?: ApiMoveType[];
  sort?: MoversSortValue; //Value임 (Field가 아니라)
  limit?: number;
  //cursor없음
}

/**
 * 기사님 목록 무한 스크롤 조회.
 * - 지역·서비스 미선택: 해당 쿼리 생략 → 전체 조회
 * - 기본 정렬: 리뷰 많은순(reviewCount desc)
 */
export const useMoversList = ({
  keyword, //한줄 설명, 기사님 이름에서 검색
  regions = [], //없다면 전체 조회
  moveTypes = [], //없다면 전체 조회
  sort = 'reviewCountDesc', //가본 정렬은 '리뷰순'
  limit = 10,
}: UseMoversListParams) => {
  const stableRegions = useMemo(
    () => toStableOptions(regions), //안정화한 지역 배열 (배열을 리턴해줌)
    [regions]
  );
  const stableMoveTypes = useMemo(
    () => toStableOptions(moveTypes), //안정화한 서비스 배열
    [moveTypes]
  );

  const apiSort = SORT_VALUE_TO_API[sort]; //FE의 sort값을 BE의 sort값으로 매핑해준 것. sort에 대한 BE값이 apiSort에 저장됨.

  //백엔드로 보낼 쿼리 파라미터를 매핑함.
  const queryParams = useMemo(
    (): Omit<MoversListParams, 'cursor'> => ({
      keyword: keyword?.trim() || undefined,
      regions: stableRegions.length > 0 ? stableRegions : undefined, //지역이 있으면 지역 배열을 보내고, 없으면 undefined를 보냄.
      moveTypes: stableMoveTypes.length > 0 ? stableMoveTypes : undefined, //서비스가 있으면 서비스 배열을 보내고, 없으면 undefined를 보냄.
      sort: apiSort,
      limit,
    }),
    [keyword, stableRegions, stableMoveTypes, apiSort, limit] //의존성 배열.
  );

  //무한 스크롤로 데이터를 가져오는 리액트 훅
  const query = useInfiniteQuery({
    queryKey: moverQueryKeys.list(queryParams), //쿼리 파라미터의 키를 생성해줌.
    queryFn: ({ pageParam }) =>
      //현 페이지의 마지막 아이템 id를 넣어주면,
      getMovers({
        ...queryParams,
        cursor: pageParam, //cursor는 계~속 바뀌는 값이니까, queryParmas로 관리하기엔 너무 계산량 많아져서 둘은 따로 씀.
      }),
    initialPageParam: undefined as string | undefined,
    //최초 fetch 시 사용할 "페이지 커서"의 초기값을 설정하는 옵션
    //undefined를 설정하면, 최초 fetch 시 페이지 커서가 없는 상태로 시작
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    //다음 페이지를 불러올 때 사용할 "커서" 값을 반환하는 함수
    placeholderData: keepPreviousData,
    //새로운 데이터를 로딩하는 동안 이전 데이터를 그대로 보여줍니다
  });

  //기사님 목록을 카드 UI로 바꾼 후 모두 합쳐서 하나의 배열을 만드는 함수.
  const movers = useMemo(
    () =>
      query.data?.pages.flatMap((page) =>
        page.data.items.map(toMoverCardModelFromListItem)
      ) ?? [],
    [query.data]
  );

  return {
    ...query,
    movers,
    isEmpty: !query.isPending && !query.isError && movers.length === 0, //데이터 패치가 한 번이라도 된 상태.(뭐라고 mover가 있긴 함)
  };
};
