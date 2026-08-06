/**
 * 커뮤니티 게시글·댓글·대댓글 시드
 * Usage: node scripts/seed-community-posts.mjs
 */
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8000';
const PASSWORD = 'Password123@@';
const USER_TYPE = 'CUSTOMER';

const ACCOUNTS = Array.from({ length: 10 }, (_, index) => ({
  email: `move${index + 10}@email.com`,
}));

const IMAGE_DIR =
  process.env.SEED_IMAGE_DIR ??
  '/Users/apple/.cursor/projects/Users-apple-Desktop-Part4-12-moving-team3-FE/assets';

const IMAGE_FILES = [
  'image-a776258e-2a9b-444a-a086-5c70d2a90416.png',
  'image-52d8b82b-ff2d-4acf-bcb7-968ec0efbdd7.png',
  'image-80272ab5-3010-4a4a-9ffc-17f36bd4ce99.png',
  'image-85bb78e5-3a95-4779-8e60-229d5af49bcb.png',
  'image-6b02c9f9-5567-4305-80ee-cccd14c65247.png',
  'image-340e6416-2c11-4652-9b26-f28dfa843d87.png',
  'image-5594440f-495c-486b-a387-1201044fcc5c.png',
  'image-17bae4e1-6ab3-4425-8e1a-d78b8f671127.png',
  'image-471e5303-fafb-42ca-993c-a0c1822de68c.png',
  'image-21bb1b35-841c-4d95-acaa-269ce2958d8a.png',
];

const REGIONS = [
  'SEOUL',
  'GYEONGGI',
  'INCHEON',
  'BUSAN',
  'DAEGU',
  'GWANGJU_JEONNAM',
  'DAEJEON',
  'JEJU',
];

/** 가구나눔 — region별 대표 좌표 */
const REGION_COORDS = {
  SEOUL: { latitude: 37.5665, longitude: 126.978 },
  GYEONGGI: { latitude: 37.4138, longitude: 127.5183 },
  INCHEON: { latitude: 37.4563, longitude: 126.7052 },
  BUSAN: { latitude: 35.1796, longitude: 129.0756 },
  DAEGU: { latitude: 35.8714, longitude: 128.6014 },
  GWANGJU_JEONNAM: { latitude: 35.1595, longitude: 126.8526 },
  DAEJEON: { latitude: 36.3504, longitude: 127.3845 },
  JEJU: { latitude: 33.4996, longitude: 126.5312 },
};

const POSTS = [
  {
    category: 'MOVING_TIP',
    title: '원룸 이사 짐 싸는 순서 정리해봤어요',
    content:
      '큰 가구부터 분해하고, 의류는 옷장 그대로 박스에 넣으면 시간이 절반으로 줄더라고요. 테이프와 마커는 최소 3개 이상 준비하세요!',
  },
  {
    category: 'MOVING_TIP',
    title: '이사 당일 필수 체크리스트 공유',
    content:
      '열쇠 반납, 가스/전기 차단, 우편물 전달 신청, 인터넷 해지까지 미리 메모해두면 당일 헷갈리지 않습니다.',
  },
  {
    category: 'MOVING_TIP',
    title: '비 오는 날 이사할 때 팁',
    content:
      '비닐과 랩핑 필름을 넉넉히 챙기고, 현관부터 방까지 비닐 매트를 깔아두면 바닥도 안전해요.',
  },
  {
    category: 'QUESTION',
    title: '포장이사 vs 반포장이사 뭐가 나을까요?',
    content:
      '1인 가구인데 짐이 생각보다 많아요. 직접 포장할 자신은 있는데 시간이 부족해서 고민 중입니다.',
  },
  {
    category: 'QUESTION',
    title: '이사 견적 받을 때 꼭 확인할 항목 있나요?',
    content:
      '엘리베이터 사용료, 사다리차, 주차비가 포함인지 헷갈려요. 경험 있으신 분 조언 부탁드립니다.',
  },
  {
    category: 'QUESTION',
    title: '보증금 돌려받기 전에 수리해야 할까요?',
    content:
      '벽지 오염이랑 못 자국이 있는데, 직접 수리하고 나가는 게 나을지 궁금합니다.',
  },
  {
    category: 'QUESTION',
    title: '이사 후 인터넷 개통 며칠 전에 신청하나요?',
    content:
      '다음 주 토요일 입주 예정인데, 개통 일정 어떻게 잡는 게 좋을까요?',
  },
  {
    category: 'REVIEW',
    title: '주말 이사 무사히 끝났습니다 (만족 후기)',
    content:
      '시간 약속 정확했고, 큰 가구도 scratches 없이 옮겨주셨어요. 포장 상태도 깔끔했습니다.',
  },
  {
    category: 'REVIEW',
    title: '첫 자취 이사 후기 — 생각보다 빨리 끝났어요',
    content:
      '혼자 하려다가 업체 도움 받았는데, 3시간 만에 끝났습니다. 다음에도 이용할 의향 있어요.',
  },
  {
    category: 'REVIEW',
    title: '가구 재조립까지 해준 업체 후기',
    content:
      '침대랑 책상 재조립까지 포함이라 당일 바로 생활할 수 있었습니다. 꼼꼼하게 마무리해주셨어요.',
  },
  {
    category: 'REVIEW',
    title: '장거리 이사 후기 (경기 → 부산)',
    content:
      '장거리라 걱정했는데, 짐 상태 확인도 중간에 해주고 도착 시간도 정확했습니다.',
  },
  {
    category: 'ETC',
    title: '이사하면서 버린 물건 목록 공유',
    content:
      '오래된 서랍장, 작은 선반, 안 쓰는 가전 정리했습니다. 비슷한 경험 있으신 분들 댓글로 공유해요.',
  },
  {
    category: 'ETC',
    title: '이사 박스 나눔합니다 (일부 사용 흔적 있음)',
    content:
      '깨끗한 박스 10개 정도 남았어요. 직접 수령 가능하신 분 연락 주세요.',
  },
  {
    category: 'ETC',
    title: '이사 후 정리하다가 남은 포장재',
    content:
      '랩핑 필름, 에어캡, 마커 등 남은 포장재 나눔합니다. 필요하신 분 댓글 남겨주세요.',
  },
  {
    category: 'FURNITURE_SHARE',
    region: 'SEOUL',
    title: '2인용 소파 나눔 (직접 수거)',
    content:
      '이사하면서 교체해서 기존 소파 나눔합니다. 사용감은 있지만 프레임 튼튼해요. 엘리베이터 있어요.',
  },
  {
    category: 'FURNITURE_SHARE',
    region: 'GYEONGGI',
    title: '책상 + 의자 세트 드려요',
    content:
      '원룸용 책상과 의자 세트입니다. 3월 말까지 수거 가능하고, 분해는 제가 해둘게요.',
  },
  {
    category: 'FURNITURE_SHARE',
    region: 'INCHEON',
    title: '수납장 2단 나눔합니다',
    content:
      '깊이가 깊어서 수납 좋아요. 모서리 약간 기스 있습니다. 픽업만 가능합니다.',
  },
  {
    category: 'FURNITURE_SHARE',
    region: 'BUSAN',
    title: '행거 + 전신거울 세트 나눔',
    content:
      '이사 후 공간이 안 맞아서 드립니다. 전신거울은 별도 분리 가능해요.',
  },
  {
    category: 'FURNITURE_SHARE',
    region: 'DAEGU',
    title: '접이식 테이블 + 의자 2개',
    content:
      '잠깐 쓰고 보관만 했던 가구예요. 접어서 차 트렁크에 실을 수 있을 정도 크기입니다.',
  },
  {
    category: 'FURNITURE_SHARE',
    region: 'JEJU',
    title: '작은 협탁 2개 + 스탠드 조명',
    content:
      '원목 협탁 2개랑 스탠드 조명 나눔합니다. 함께 가져가셔도 되고 따로도 가능해요.',
  },
];

const COMMENT_POOL = [
  '좋은 정보 감사합니다!',
  '저도 곧 이사라 참고할게요.',
  '혹시 비용대는 어느 정도였나요?',
  '사진 보니 상태 괜찮아 보여요.',
  '아직 가능한가요?',
  '직접 수거 가능합니다.',
  '시간대는 주말이 편해요.',
  '연락처 남겨도 될까요?',
  '저도 비슷한 경험 있었어요.',
  '도움 많이 됐습니다 :)',
  '대댓글로 답변 드릴게요!',
  '네 가능합니다!',
  '내일 오후에 방문 가능해요.',
  '감사합니다, 확인했어요.',
  '추가 사진 부탁드려요.',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 게시글별 0~5장 */
const pickImages = (postIndex) => {
  const count = postIndex % 6;
  const selected = [];

  for (let index = 0; index < count; index += 1) {
    selected.push(IMAGE_FILES[(postIndex + index) % IMAGE_FILES.length]);
  }

  return [...new Set(selected)];
};

/** 게시글별 댓글+대댓글 합계 0~5 */
const getCommentTotal = (postIndex) => (postIndex + 3) % 6;

const seedComments = async (tokens, postId, postIndex) => {
  const total = getCommentTotal(postIndex);

  if (total === 0) {
    return 0;
  }

  const topCount = total <= 2 ? total : 2;
  const replyCount = total - topCount;
  let firstCommentId = null;

  for (let topIndex = 0; topIndex < topCount; topIndex += 1) {
    const author = ACCOUNTS[(postIndex + topIndex + 1) % ACCOUNTS.length];
    const commentId = await createComment(
      tokens[author.email],
      postId,
      COMMENT_POOL[(postIndex + topIndex) % COMMENT_POOL.length]
    );

    if (topIndex === 0) {
      firstCommentId = commentId;
    }
  }

  for (let replyIndex = 0; replyIndex < replyCount; replyIndex += 1) {
    const author = ACCOUNTS[(postIndex + replyIndex + 3) % ACCOUNTS.length];
    await createReply(
      tokens[author.email],
      postId,
      firstCommentId,
      COMMENT_POOL[(postIndex + replyIndex + 5) % COMMENT_POOL.length]
    );
  }

  return total;
};

const apiFetch = async (path, { method = 'GET', token, body } = {}) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `${method} ${path} failed (${response.status}): ${JSON.stringify(json)}`
    );
  }

  return json;
};

const login = async (email) => {
  const json = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: {
      userType: USER_TYPE,
      email,
      password: PASSWORD,
    },
  });

  return json.data.accessToken;
};

const uploadImage = async (token, filePath) => {
  const filename = basename(filePath);
  const buffer = readFileSync(filePath);
  const contentType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const presigned = await apiFetch(
    `/api/presigned-upload-url?${new URLSearchParams({
      filename,
      contentType,
      prefix: 'posts',
    }).toString()}`,
    { token }
  );

  const uploadResponse = await fetch(presigned.data.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    throw new Error(`S3 upload failed for ${filename} (${uploadResponse.status})`);
  }

  return presigned.data.s3Key;
};

const createPost = async (token, post, imageKeys) => {
  const body = {
    category: post.category,
    title: post.title,
    content: post.content,
    imageKeys,
  };

  if (post.category === 'FURNITURE_SHARE') {
    const region = post.region ?? REGIONS[0];
    const coords = REGION_COORDS[region] ?? REGION_COORDS.SEOUL;
    body.region = region;
    body.latitude = coords.latitude;
    body.longitude = coords.longitude;
  }

  const json = await apiFetch('/api/posts', {
    method: 'POST',
    token,
    body,
  });

  return json.data.id;
};

const createComment = async (token, postId, content) => {
  const json = await apiFetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    token,
    body: { content },
  });

  return json.data.id;
};

const createReply = async (token, postId, commentId, content) => {
  await apiFetch(`/api/posts/${postId}/comments/${commentId}/replies`, {
    method: 'POST',
    token,
    body: { content },
  });
};

const deletePost = async (token, postId) => {
  await apiFetch(`/api/posts/${postId}`, {
    method: 'DELETE',
    token,
  });
};

/** 이전 시드 게시글 삭제 (authorIndex → ACCOUNTS) */
const PREVIOUS_SEED_POSTS = [
  ...Array.from({ length: 14 }, (_, index) => ({
    id: 8 + index,
    authorIndex: index,
  })),
  ...Array.from({ length: 6 }, (_, index) => ({
    id: 23 + index,
    authorIndex: 14 + index,
  })),
];

const deletePreviousSeedPosts = async (tokens) => {
  console.log('Deleting previous seed posts...');

  for (const entry of PREVIOUS_SEED_POSTS) {
    const author = ACCOUNTS[entry.authorIndex % ACCOUNTS.length];

    try {
      await deletePost(tokens[author.email], entry.id);
      console.log(`  deleted #${entry.id}`);
    } catch (error) {
      console.warn(`  skip #${entry.id}: ${error.message}`);
    }

    await sleep(100);
  }
};

const START_INDEX = Number(process.env.SEED_START_INDEX ?? 0);
const DELETE_PREVIOUS = process.env.SEED_DELETE_PREVIOUS === '1';

const main = async () => {
  console.log(`API: ${API_BASE_URL}`);
  console.log(`Images: ${IMAGE_DIR}`);

  const tokens = {};

  for (const account of ACCOUNTS) {
    tokens[account.email] = await login(account.email);
    console.log(`Logged in: ${account.email}`);
  }

  if (DELETE_PREVIOUS) {
    await deletePreviousSeedPosts(tokens);
  }

  const createdPostIds = [];

  for (let index = START_INDEX; index < POSTS.length; index += 1) {
    const post = POSTS[index];
    const author = ACCOUNTS[index % ACCOUNTS.length];
    const token = tokens[author.email];
    const imageNames = pickImages(index);
    const imageKeys = [];

    for (const imageName of imageNames) {
      const filePath = join(IMAGE_DIR, imageName);
      const s3Key = await uploadImage(token, filePath);
      imageKeys.push(s3Key);
      await sleep(150);
    }

    const postId = await createPost(token, post, imageKeys);
    createdPostIds.push(postId);

    const commentTotal = await seedComments(tokens, postId, index);

    console.log(
      `[${index + 1}/${POSTS.length}] post #${postId} by ${author.email} (${imageKeys.length} imgs, ${commentTotal} comments)`
    );

    await sleep(200);
  }

  console.log('\nDone.');
  console.log(`Created ${createdPostIds.length} posts: ${createdPostIds.join(', ')}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
