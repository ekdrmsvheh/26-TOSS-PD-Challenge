/**
 * memberThumbnails
 *
 * 참석 인원 선택 모달(AttendeeSelectDialog) 등에서 프로필 사진으로 쓰는 멤버 썸네일.
 * `src/assets/member thumbnail/`의 image 1~6.jpg를 파일명 순으로 로드한다.
 * (폴더/파일명에 공백이 있어 정적 import 대신 import.meta.glob로 안전하게 해석)
 */
const modules = import.meta.glob('../assets/member thumbnail/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const memberThumbnails = Object.keys(modules)
  .sort()
  .map((key) => modules[key]);

/**
 * 인덱스로 멤버 썸네일 하나를 가져온다. 이미지가 6장이라 index를 modulo로 순환시킨다.
 * @param {number} index - 멤버 순번
 * @returns {string} 이미지 URL
 */
export const memberThumbnail = (index) => memberThumbnails[index % memberThumbnails.length];
