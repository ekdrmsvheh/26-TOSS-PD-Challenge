import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { CardContainer } from '../card/CardContainer';
import { RecommendedTimeCard } from '../card/RecommendedTimeCard';
import { CalendarAvailabilityCard } from '../card/CalendarAvailabilityCard';
import { AttendeeSelectDialog } from '../input/AttendeeSelectDialog';
import { DateRangePicker } from '../input/DateRangePicker';
import { TimeSelectPopover } from '../input/TimeSelectPopover';
import { SelectTrigger } from '../input/SelectTrigger';
import { CardPageLayout } from '../layout/CardPageLayout';
import { primitives } from '../../styles/themes';
import { memberThumbnail } from '../../data/memberThumbnails';

/**
 * AvailableScheduleView 템플릿
 *
 * "미팅 일정" 화면 — 미팅 조건(참여 인원/시간 조건)을 입력하고 가능한 일정을
 * 추천 카드 + 주간 캘린더로 보여준다. Toss 테마 토큰(`theme.palette`)만 참조하며
 * 컴포넌트 안에 색상을 하드코딩하지 않는다.
 *
 * 동작 방식:
 * 1. hasConditions가 false면 우측에 빈 상태(안내 문구)만 보여준다
 * 2. hasConditions가 true면 추천 시간 카드(RecommendedTimeCard, 3열 그리드+모두보기) + 캘린더 카드
 *    (CalendarAvailabilityCard, 범례+상세보기) + "다음" 버튼을 보여준다
 * 3. 추천 시간 카드는 참석자에게 확인 요청할 "후보 시간 묶음"을 고르는 체크박스 선택 UI다(최종 시간
 *    1개를 확정하는 화면이 아니다). 기본 3개가 선택된 채 시작하고, 카드 클릭으로 선택/해제한다
 *    (최소 1개 유지, 모든 후보 보기 시 최대 5개). 선택 상태는 캘린더 셀 강조와 양방향 동기화되어
 *    캘린더 셀을 클릭해도 카드 선택이 토글된다. "다음"은 1개 이상 선택돼야 활성화된다
 * 4. 캘린더 셀 색은 "추천 가능 시간"을 의미한다 (하드코딩 데모 데이터, 실제 일정 연동 없음). 상세보기를
 *    켜면 참석자별 일정이 셀 안에 펼쳐지고, 조정 원인이 되는 일정에는 점 마커 + 볼드가 붙는다
 * 5. 참여 인원 아바타의 +/편집 버튼을 누르면 AttendeeSelectDialog가 열려 필수/선택 토글과 삭제로 참여 인원을 편집한다
 * 6. 미팅 길이/조회 시간(시작·종료)은 모두 TimeSelectPopover(검색 입력 + 스크롤 리스트, 클릭 즉시 반영)로 고른다
 * 7. 조회 기간 필드는 DateRangePicker로 편집한다 — 프리셋(오늘/내일/이번주/다음주/이번달/직접 입력) 클릭 시 즉시
 *    반영되고, 하루만 클릭하면 단일일, 시작·종료를 각각 클릭하면 기간이 된다
 *
 * Props:
 * @param {boolean} hasConditions - 조건 입력 완료 여부 [Optional, 기본값: false]
 * @param {'A'|'B'} scenario - A(해피 패스, 전원 참석 가능)/B(조정 상황, 일정 조정 필요) — 추천 시간·캘린더
 *   카드의 색상(blue/orange)과 데이터가 이 값에 따라 바뀐다 [Optional, 기본값: 'A']
 * @param {function} onShowSchedule - "가능한 시간 찾기" 클릭 핸들러 [Optional]
 * @param {function} onEditAttendees - 참여 인원 편집 다이얼로그를 여는 시점에 함께 호출되는 알림 핸들러 [Optional]
 * @param {function} onNext - "다음" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AvailableScheduleView hasConditions={hasConditions} onShowSchedule={() => setHasConditions(true)} />
 */

// Figma "Icon/Normal/Calendar" 원본 path — 추천 시간 카드 빈 상태(조건 설정 전) 전용 아이콘.
// fill은 원본 지정색(#B0B8C1)과 동일한 theme 토큰(grey.400)을 sx color로 넘겨 사용한다.
function EmptyScheduleCalendarIcon(props) {
  return (
    <SvgIcon viewBox="0 0 40 40" {...props}>
      <path d="M35 29.5C35 32.5376 32.5376 35 29.5 35H10.5C7.46243 35 5 32.5376 5 29.5V17.5H35V29.5ZM30 5.02539C32.8031 5.27813 35 7.63107 35 10.5V14.5H5V10.5C5 7.63107 7.19688 5.27813 10 5.02539V5H12V2.5C12 1.67157 12.6716 1 13.5 1C14.3284 1 15 1.67157 15 2.5V5H25V2.5C25 1.67157 25.6716 1 26.5 1C27.3284 1 28 1.67157 28 2.5V5H30V5.02539Z" />
    </SvgIcon>
  );
}

// 참여 인원 선택 모달(AttendeeSelectDialog)에서는 이니셜 대신 인물 사진 썸네일을 쓴다.
// `src/assets/member thumbnail/`의 멤버 썸네일(6장)을 index modulo로 순환시켜 재사용한다.
const portraitThumb = (index) => memberThumbnail(index);

const HOST = { fullName: '이지혜', role: '제품팀 · 프로덕트 디자이너', avatarSrc: portraitThumb(0) };

// 참여 인원 선택 모달의 검색 드롭다운에서 고를 수 있는 동료 후보 목록 (fullName 기준, roleLevel은 추가될 때 정해짐)
const DIRECTORY = [
  { id: 'p1', name: '정희', role: '제품팀 · 리드', avatarSrc: portraitThumb(1) },
  { id: 'p2', name: '이상륜', role: '개발팀 · 리드', avatarSrc: portraitThumb(2) },
  { id: 'p3', name: '허지은', role: '제품팀 · 프로덕트 매니저', avatarSrc: portraitThumb(3) },
  { id: 'p4', name: '신창철', role: '개발팀 · 프론트엔드', avatarSrc: portraitThumb(4) },
  { id: 'p5', name: '김주연', role: '개발팀 · 백엔드', avatarSrc: portraitThumb(5) },
  { id: 'p6', name: '박서준', role: '디자인팀 · UX 디자이너', avatarSrc: portraitThumb(6) },
  { id: 'p7', name: '최유나', role: '마케팅팀 · 마케터', avatarSrc: portraitThumb(7) },
  { id: 'p8', name: '정도윤', role: '데이터팀 · 데이터 분석가', avatarSrc: portraitThumb(8) },
  { id: 'p9', name: '한소영', role: '세일즈팀 · 세일즈 매니저', avatarSrc: portraitThumb(9) },
  { id: 'p10', name: '오태민', role: '개발팀 · 백엔드', avatarSrc: portraitThumb(10) },
  { id: 'p11', name: '윤지호', role: '제품팀 · 프로덕트 매니저', avatarSrc: portraitThumb(11) },
  { id: 'p12', name: '강민재', role: '개발팀 · 프론트엔드', avatarSrc: portraitThumb(12) },
  { id: 'p13', name: '서예은', role: 'HR팀 · 인사 담당자', avatarSrc: portraitThumb(13) },
  { id: 'p14', name: '임현우', role: '재무팀 · 재무 담당자', avatarSrc: portraitThumb(14) },
  { id: 'p15', name: '배수진', role: '운영팀 · 오퍼레이션', avatarSrc: portraitThumb(15) },
  { id: 'p16', name: '조은비', role: 'CS팀 · CS 매니저', avatarSrc: portraitThumb(16) },
  { id: 'p17', name: '남기훈', role: '개발팀 · 인프라', avatarSrc: portraitThumb(17) },
  { id: 'p18', name: '홍유민', role: '디자인팀 · 프로덕트 디자이너', avatarSrc: portraitThumb(18) },
  { id: 'p19', name: '문세아', role: '마케팅팀 · 콘텐츠 마케터', avatarSrc: portraitThumb(19) },
  { id: 'p20', name: '신동혁', role: '데이터팀 · 데이터 엔지니어', avatarSrc: portraitThumb(20) },
  { id: 'p21', name: '권나윤', role: '제품팀 · 프로덕트 오너', avatarSrc: portraitThumb(21) },
  { id: 'p22', name: '장하율', role: '개발팀 · QA', avatarSrc: portraitThumb(22) },
  { id: 'p23', name: '백승우', role: '세일즈팀 · 어카운트 매니저', avatarSrc: portraitThumb(23) },
  { id: 'p24', name: '유가은', role: 'HR팀 · 리크루터', avatarSrc: portraitThumb(24) },
  { id: 'p25', name: '노준서', role: '재무팀 · 회계 담당자', avatarSrc: portraitThumb(25) },
];

// 아바타에는 성을 뺀 이름 2글자만 표시한다 (예: '이지혜' → '지혜')
const shortName = (fullName) => fullName.slice(-2);

// 참여 인원 아바타 색상 규칙 — docs/product/정책/제품 데이터 정책.md 5.4절 참고
// 주최자(가장 진한 파랑) → 필수 참석자(파랑, 순서대로 옅어짐) → 선택 참석자(회색, 순서대로 옅어짐)
const requiredAvatarTones = [primitives.blue[600], primitives.blue[500], primitives.blue[400], primitives.blue[300]];
const optionalAvatarTones = [primitives.grey[500], primitives.grey[400]];

// Figma 최종본 커스텀 값 — "가능한 시간 찾기" 버튼 전용(표준 팔레트에 없는 정확한 지정색)
const INTERACTION_DISABLE_BG = '#F4F4F5'; // interaction/disable
const LABEL_ASSISTIVE_COLOR = 'rgba(55,56,60,0.28)'; // label/assistive

// "가능한 시간 찾기" 클릭 시 강제로 적용되는 고정 테스트 값 — 프로토타입 테스터가 폼에 어떤 값을
// 넣었든 결과 화면(추천 시간/캘린더)은 항상 이 값 기준으로 보여준다 (recommendedSlots/cellStates가
// 하드코딩 데모 데이터라 실제 폼 값과 연동되지 않으므로, 화면에 보이는 조건 표시도 데모와 맞춰 고정한다)
const TEST_PARTICIPANTS = [
  { id: 'p1', fullName: '정희', role: '제품팀 · 리드', avatarSrc: portraitThumb(1), roleLevel: 'required' },
  { id: 'p2', fullName: '이상륜', role: '개발팀 · 리드', avatarSrc: portraitThumb(2), roleLevel: 'required' },
  { id: 'p3', fullName: '허지은', role: '제품팀 · 프로덕트 매니저', avatarSrc: portraitThumb(3), roleLevel: 'required' },
  { id: 'p4', fullName: '신창철', role: '개발팀 · 프론트엔드', avatarSrc: portraitThumb(4), roleLevel: 'optional' },
  { id: 'p5', fullName: '김주연', role: '개발팀 · 백엔드', avatarSrc: portraitThumb(5), roleLevel: 'optional' },
];
const TEST_DURATION = '1시간';
const TEST_DATE_RANGE = { start: new Date(2026, 6, 13), end: new Date(2026, 6, 17) };
const TEST_SEARCH_START = '오전 9:00';
const TEST_SEARCH_END = '오후 5:00';

// 추천 시간 카드 슬롯 — 각 슬롯의 cellKey(`${dayIndex}-${hourIndex}`)로 캘린더의 같은 셀과
// 연결된다(선택 상태가 카드↔셀 양방향으로 동기화되는 기준). 시나리오 A(해피 패스)/B(조정 상황)
// 각각 Figma 최종본 데이터를 그대로 반영한다 — B의 2·3번 캡션이 동일한 것("지혜/상륜님...")과
// 4·5번 캡션이 동일한 것("정희님 일정 조정 시 전원 참여")은 Figma 원본 그대로다(오타로 보이지만
// 정확한 재현을 위해 그대로 둠)
const HAPPY_SLOTS = [
  { dateTime: '7/13(월) 오전 10:00', caption: '전원 참석, 가장 빠른 시간', cellKey: '0-1' },
  { dateTime: '7/14(화) 오후 12:00', caption: '전원 참석, 두번째로 빠른 시간', cellKey: '1-3' },
  { dateTime: '7/15(수) 오후 5:00', caption: '전원 참석, 세번째로 빠른 시간', cellKey: '2-8' },
  { dateTime: '7/16(목) 오전 11:00', caption: '전원 참석, 네번째로 빠른 시간', cellKey: '3-2' },
  { dateTime: '7/16(목) 오후 2:00', caption: '전원 참석, 다섯번째로 빠른 시간', cellKey: '3-5' },
];

const ADJUST_SLOTS = [
  { dateTime: '7/14(화) 오전 11:00', caption: '정희님 선택 참여 일정 조정 시, 전원 참석', cellKey: '1-2' },
  { dateTime: '7/13(월) 오후 2:00', caption: '지혜/상륜님 선택 참여 일정 조정 시, 전원 참석', cellKey: '0-5' },
  { dateTime: '7/15(수) 오후 4:00', caption: '지혜/상륜님 선택 참여 일정 조정 시, 전원 참석', cellKey: '2-7' },
  { dateTime: '7/16(목) 오전 11:00', caption: '정희님 일정 조정 시 전원 참여', cellKey: '3-2' },
  { dateTime: '7/16(목) 오후 2:00', caption: '정희님 일정 조정 시 전원 참여', cellKey: '3-5' },
];

const days = [
  { label: '월', date: 13 },
  { label: '화', date: 14 },
  { label: '수', date: 15 },
  { label: '목', date: 16 },
  { label: '금', date: 17 },
];

const hours = ['오전 9:00', '오전 10:00', '오전 11:00', '오후 12:00', '오후 1:00', '오후 2:00', '오후 3:00', '오후 4:00', '오후 5:00'];

// 추천 후보와 무관한 순수 정보성 셀(선택 불가) — 나머지 강조 셀은 전부 슬롯 선택 상태에서
// 매 렌더 시 파생된다(derivedCellStates, 컴포넌트 본문 참고)
const HAPPY_BASE_CELL_STATES = { '4-5': 'empty' }; // 17일(금) 오후 2:00 — 아무도 일정 없는 빈 시간
const ADJUST_BASE_CELL_STATES = {};

// 상세보기 ON 시 셀 안에 펼쳐지는 참석자별 일정 — Figma 최종본 캘린더 상세보기 프레임을 그대로 옮김
// (참여 인원 이름은 좌측 카드 참석자와 무관하게 Figma 원본 표기를 그대로 사용한다)
const HAPPY_EVENTS = {
  '0-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '1-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '2-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '3-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '4-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '1-1': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }, { person: '상륜', title: '배포 준비' }],
  '2-1': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '3-1': [{ person: '지혜', title: '주간회고' }, { person: '주연', title: '디자인 QA' }],
  '4-1': [{ person: '정희', title: '1:1 미팅' }, { person: '주연', title: '디자인 QA' }],
  '0-2': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '1-2': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '2-2': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '4-2': [{ person: '지혜', title: '주간회고' }],
  '2-3': [{ person: '지혜', title: '제품팀 정기회의' }, { person: '정희', title: '제품팀 정기회의' }, { person: '지은', title: '제품팀 정기회의' }],
  '0-4': [{ title: '점심시간' }],
  '1-4': [{ person: '지혜', title: '주간회고' }],
  '2-4': [{ title: '점심시간' }],
  '3-4': [{ title: '점심시간' }],
  '4-4': [{ title: '점심시간' }],
  '0-5': [{ person: '창철', title: '개발팀 회고' }, { person: '상륜', title: '개발팀 회고' }],
  '0-6': [{ person: '주연', title: '디자인 QA' }],
  '2-6': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '0-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '1-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '2-7': [{ person: '지혜', title: '주간회고' }],
  '3-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '4-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '0-8': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '1-8': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '3-8': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '4-8': [{ person: '주연', title: '디자인 QA' }],
};

// 조정 상황 시나리오 — isConflict:true인 항목이 조정이 필요한 원인 일정(속이 빈 마커 + 강조색)이다
const ADJUST_EVENTS = {
  '0-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '1-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '2-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '3-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '4-0': [{ person: '지혜', title: '고객사 모니터링' }],
  '0-1': [{ person: '주연', title: '디자인 QA' }],
  '1-1': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '2-1': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '3-1': [{ person: '지혜', title: '주간회고' }, { person: '주연', title: '디자인 QA' }],
  '4-1': [{ person: '정희', title: '1:1 미팅' }, { person: '주연', title: '디자인 QA' }],
  '0-2': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '1-2': [{ person: '정희', title: '디자인 QA', isConflict: true }],
  '2-2': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '3-2': [{ person: '정희', title: '디자인 QA', isConflict: true }],
  '4-2': [{ person: '지혜', title: '주간회고' }],
  '2-3': [{ person: '지혜', title: '제품팀 정기회의' }, { person: '정희', title: '제품팀 정기회의' }, { person: '지은', title: '제품팀 정기회의' }],
  '0-4': [{ title: '점심시간' }],
  '1-4': [{ person: '지혜', title: '주간회고' }],
  '2-4': [{ title: '점심시간' }],
  '3-4': [{ title: '점심시간' }],
  '4-4': [{ title: '점심시간' }],
  '0-5': [{ person: '지혜', title: '디자인 QA', isConflict: true }, { person: '상륜', title: '개발 주간 회의', isConflict: true }],
  '2-5': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '4-5': [{ person: '지혜', title: '1:1 미팅', isConflict: true }, { person: '정희', title: '1:1 미팅', isConflict: true }],
  '0-6': [{ person: '주연', title: '개발 주간 회의' }],
  '2-6': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '0-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '1-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '2-7': [{ person: '지혜', title: '주간회고', isConflict: true }],
  '3-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '4-7': [{ person: '상륜', title: '배포 준비' }, { person: '주연', title: '디자인 QA' }],
  '0-8': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '1-8': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '3-8': [{ person: '지혜', title: '주간회고' }, { person: '정희', title: '1:1 미팅' }],
  '4-8': [{ person: '주연', title: '디자인 QA' }],
};

// 미팅 길이 — 조회 시간과 동일한 TimeSelectPopover(검색 입력 + 스크롤 리스트)를 재사용한다
const DURATION_OPTIONS = ['30분', '1시간', '1시간 30분', '2시간', '3시간', '4시간'];

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const formatDate = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY_LABELS[date.getDay()]})`;
const formatDateRange = (range) => {
  if (!range?.start) return '전체';
  return `${formatDate(range.start)} ~ ${formatDate(range.end ?? range.start)}`;
};
// 조회 기간 프리셋 — "직접 입력"은 start를 비워서 캘린더에서 새로 고르게 한다 (DateRangePicker가 null을 처리)
const RANGE_PRESETS = [
  { label: '오늘', getRange: () => { const d = startOfToday(); return { start: d, end: d }; } },
  { label: '내일', getRange: () => { const d = addDays(startOfToday(), 1); return { start: d, end: d }; } },
  {
    label: '이번주',
    getRange: () => {
      const today = startOfToday();
      return { start: today, end: addDays(today, 6 - today.getDay()) };
    },
  },
  {
    label: '다음주',
    getRange: () => {
      const today = startOfToday();
      const nextMonday = addDays(today, 8 - today.getDay());
      return { start: nextMonday, end: addDays(nextMonday, 6) };
    },
  },
  {
    label: '이번달',
    getRange: () => {
      const today = startOfToday();
      return { start: startOfMonth(today), end: endOfMonth(today) };
    },
  },
  { label: '직접 입력', getRange: () => ({ start: null, end: null }) },
];

// 30분 단위 하루 전체 시간 슬롯 (오전 12:00 ~ 오후 11:30, 48개) — TimeSelectPopover 리스트용
const SEARCH_TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const period = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${period} ${hour12}:${minute === 0 ? '00' : minute}`;
});

export function AvailableScheduleView({ hasConditions = false, scenario = 'A', onShowSchedule, onEditAttendees, onNext, sx }) {
  const isAdjust = scenario === 'B';
  const cardScenario = isAdjust ? 'adjust' : 'recommend';
  const slots = isAdjust ? ADJUST_SLOTS : HAPPY_SLOTS;
  const baseCellStates = isAdjust ? ADJUST_BASE_CELL_STATES : HAPPY_BASE_CELL_STATES;
  const calendarEvents = isAdjust ? ADJUST_EVENTS : HAPPY_EVENTS;

  // 추천 후보 선택 상태 — "후보 시간 묶음"을 고르는 체크박스 선택 집합(dateTime 기준).
  // 기본 3개(목록상 앞의 3개)가 선택된 상태로 시작하고, 시나리오가 바뀌면 다시 초기화된다
  const [selectedSlotKeys, setSelectedSlotKeys] = useState(() => new Set(slots.slice(0, 3).map((s) => s.dateTime)));

  useEffect(() => {
    setSelectedSlotKeys(new Set(slots.slice(0, 3).map((s) => s.dateTime)));
  }, [slots]);

  // 최소 1개 유지, 최대 5개 제한을 지키며 토글한다 — 카드 클릭과 캘린더 셀 클릭이 공유하는 핸들러
  const handleToggleSlot = (dateTime) => {
    setSelectedSlotKeys((prev) => {
      const next = new Set(prev);
      if (next.has(dateTime)) {
        if (next.size <= 1) return prev;
        next.delete(dateTime);
      } else {
        if (next.size >= 5) return prev;
        next.add(dateTime);
      }
      return next;
    });
  };

  const handleCalendarCellClick = (cellKey) => {
    const slot = slots.find((s) => s.cellKey === cellKey);
    if (slot) handleToggleSlot(slot.dateTime);
  };

  // 캘린더 셀 강조는 선택 상태에서 파생된다(단일 소스) — 선택된 슬롯 중 목록상 가장 앞선 것만
  // primary(굵은 강조), 나머지 선택된 슬롯은 secondary로 표시하고, 선택 해제되면 강조가 사라진다
  const firstSelectedDateTime = slots.find((slot) => selectedSlotKeys.has(slot.dateTime))?.dateTime;
  const cellStates = { ...baseCellStates };
  slots.forEach((slot) => {
    if (!selectedSlotKeys.has(slot.dateTime)) return;
    cellStates[slot.cellKey] = slot.dateTime === firstSelectedDateTime ? 'highlight-primary' : 'highlight';
  });
  const clickableCellKeys = new Set(slots.map((slot) => slot.cellKey));

  const [participants, setParticipants] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // "가능한 시간 찾기" 클릭 시 true로 바뀌어 버튼이 비활성 톤으로 바뀐다. 이후 시간 조건(미팅
  // 길이/조회 기간/조회 시간)을 하나라도 바꾸면 다시 활성 톤으로 돌아온다(재검색 필요 표시)
  const [justSearched, setJustSearched] = useState(false);

  // 미팅 길이
  const [duration, setDuration] = useState('1시간');
  const [durationAnchorEl, setDurationAnchorEl] = useState(null);

  // 조회 기간
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [rangeAnchorEl, setRangeAnchorEl] = useState(null);

  // 조회 시간 — 시작/종료를 각각 독립된 TimeSelectPopover로 고른다
  const [searchStart, setSearchStart] = useState('오전 9:00');
  const [searchEnd, setSearchEnd] = useState('오후 5:00');
  const [timeStartAnchorEl, setTimeStartAnchorEl] = useState(null);
  const [timeEndAnchorEl, setTimeEndAnchorEl] = useState(null);

  const openDurationPopover = (e) => setDurationAnchorEl(e.currentTarget);
  const openRangePopover = (e) => setRangeAnchorEl(e.currentTarget);
  const openStartTimePopover = (e) => setTimeStartAnchorEl(e.currentTarget);
  const openEndTimePopover = (e) => setTimeEndAnchorEl(e.currentTarget);

  const handleDurationSelect = (val) => { setDuration(val); setJustSearched(false); };
  const handleDateRangeConfirm = (val) => { setDateRange(val); setJustSearched(false); };
  const handleSearchStartSelect = (val) => { setSearchStart(val); setJustSearched(false); };
  const handleSearchEndSelect = (val) => { setSearchEnd(val); setJustSearched(false); };

  const handleShowSchedule = () => {
    // 결과 화면은 하드코딩 데모 데이터 기준이라, 폼에 어떤 값이 들어있었든 표시 조건을
    // 데모와 일치하는 고정 테스트 값으로 맞춘다 (테스터 임의 입력에 결과 화면이 깨지지 않도록)
    setParticipants(TEST_PARTICIPANTS);
    setDuration(TEST_DURATION);
    setDateRange(TEST_DATE_RANGE);
    setSearchStart(TEST_SEARCH_START);
    setSearchEnd(TEST_SEARCH_END);
    setJustSearched(true);
    onShowSchedule?.();
  };

  const requiredParticipants = participants.filter((p) => p.roleLevel === 'required');
  const optionalParticipants = participants.filter((p) => p.roleLevel === 'optional');

  const getAvatarColor = (person) => {
    if (person.roleLevel === 'required') {
      const idx = requiredParticipants.findIndex((p) => p.id === person.id);
      return requiredAvatarTones[(idx + 1) % requiredAvatarTones.length];
    }
    const idx = optionalParticipants.findIndex((p) => p.id === person.id);
    return optionalAvatarTones[idx % optionalAvatarTones.length];
  };

  const handleOpenPicker = () => {
    onEditAttendees?.();
    setPickerOpen(true);
  };

  const handleConfirmPicker = (updated) => {
    setParticipants(
      updated.map((p) => ({ id: p.id, fullName: p.name, role: p.role, roleLevel: p.roleLevel, avatarSrc: p.avatarSrc }))
    );
  };

  const leftCard = (
    <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: { xs: '100%', md: '340px' }, minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: '16px' }}>미팅 조건</Typography>

          <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.500', mb: '12px' }}>참여 인원</Typography>

          <Stack direction="row" alignItems="center" sx={{ mb: '20px' }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                zIndex: 1,
                fontSize: 12,
                fontWeight: 600,
                border: '2px solid',
                borderColor: 'background.paper',
                bgcolor: requiredAvatarTones[0],
              }}
            >
              {shortName(HOST.fullName)}
            </Avatar>
            {hasConditions &&
              requiredParticipants.map((person) => (
                <Avatar
                  key={person.id}
                  sx={{
                    width: 36,
                    height: 36,
                    ml: '-4px',
                    zIndex: 1,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '2px solid',
                    borderColor: 'background.paper',
                    bgcolor: getAvatarColor(person),
                  }}
                >
                  {shortName(person.fullName)}
                </Avatar>
              ))}
            {hasConditions &&
              optionalParticipants.map((person) => (
                <Avatar
                  key={person.id}
                  sx={{
                    width: 36,
                    height: 36,
                    ml: '-4px',
                    zIndex: 1,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '2px solid',
                    borderColor: 'background.paper',
                    bgcolor: getAvatarColor(person),
                  }}
                >
                  {shortName(person.fullName)}
                </Avatar>
              ))}
            <IconButton
              size="small"
              onClick={handleOpenPicker}
              sx={{
                width: 36,
                height: 36,
                ml: '-4px',
                zIndex: 2,
                flexShrink: 0,
                border: '1.5px dashed',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              {hasConditions ? (
                <EditOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              ) : (
                <AddIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              )}
            </IconButton>
          </Stack>

          <AttendeeSelectDialog
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            host={{ name: HOST.fullName, role: HOST.role, avatarSrc: HOST.avatarSrc, avatarColor: requiredAvatarTones[0] }}
            directory={DIRECTORY}
            participants={participants.map((p) => ({
              id: p.id,
              name: p.fullName,
              role: p.role,
              roleLevel: p.roleLevel,
              avatarSrc: p.avatarSrc,
              avatarColor: getAvatarColor(p),
            }))}
            onConfirm={handleConfirmPicker}
          />

          <Box sx={{ borderTop: '1px solid', borderColor: primitives.line.neutral, pt: '20px', mb: '32px' }}>
            <Stack spacing="8px">
              <Stack direction="row" alignItems="center">
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.500', width: '70px', flexShrink: 0 }}>미팅 길이</Typography>
                <SelectTrigger size="small" hideChevron value={duration} onClick={openDurationPopover} sx={{ flex: 1 }} />
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.500', width: '70px', flexShrink: 0 }}>조회 기간</Typography>
                <SelectTrigger
                  size="small"
                  hideChevron
                  value={dateRange?.start ? formatDateRange(dateRange) : undefined}
                  placeholder="전체"
                  onClick={openRangePopover}
                  sx={{ flex: 1 }}
                />
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.500', width: '70px', flexShrink: 0 }}>조회 시간</Typography>
                <Stack direction="row" alignItems="center" spacing="8px" sx={{ flex: 1 }}>
                  <SelectTrigger size="small" hideChevron value={searchStart} onClick={openStartTimePopover} sx={{ flex: 1 }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>~</Typography>
                  <SelectTrigger size="small" hideChevron value={searchEnd} onClick={openEndTimePopover} sx={{ flex: 1 }} />
                </Stack>
              </Stack>
            </Stack>
          </Box>

          <TimeSelectPopover
            open={Boolean(durationAnchorEl)}
            anchorEl={durationAnchorEl}
            onClose={() => setDurationAnchorEl(null)}
            options={DURATION_OPTIONS}
            value={duration}
            onSelect={handleDurationSelect}
            placeholder="길이 입력"
          />

          <DateRangePicker
            open={Boolean(rangeAnchorEl)}
            anchorEl={rangeAnchorEl}
            onClose={() => setRangeAnchorEl(null)}
            value={dateRange}
            presets={RANGE_PRESETS}
            onConfirm={handleDateRangeConfirm}
          />

          <TimeSelectPopover
            open={Boolean(timeStartAnchorEl)}
            anchorEl={timeStartAnchorEl}
            onClose={() => setTimeStartAnchorEl(null)}
            options={SEARCH_TIME_OPTIONS}
            value={searchStart}
            onSelect={handleSearchStartSelect}
          />

          <TimeSelectPopover
            open={Boolean(timeEndAnchorEl)}
            anchorEl={timeEndAnchorEl}
            onClose={() => setTimeEndAnchorEl(null)}
            options={SEARCH_TIME_OPTIONS}
            value={searchEnd}
            onSelect={handleSearchEndSelect}
          />

          <Button
            fullWidth
            disabled={justSearched}
            onClick={handleShowSchedule}
            sx={{
              bgcolor: justSearched ? INTERACTION_DISABLE_BG : primitives.blue[50],
              color: justSearched ? LABEL_ASSISTIVE_COLOR : primitives.blue[600],
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '0.144px',
              borderRadius: '10px',
              px: '20px',
              py: '9px',
              '&:hover': { bgcolor: justSearched ? INTERACTION_DISABLE_BG : primitives.blue[50] },
              '&.Mui-disabled': { bgcolor: INTERACTION_DISABLE_BG, color: LABEL_ASSISTIVE_COLOR },
            }}
          >
            가능한 시간 찾기
          </Button>
        </CardContainer>
  );

  const scheduleCard = (
    <CardContainer
      key="schedule"
      variant="elevation"
      padding="card"
      radius="card"
      sx={{ height: hasConditions ? 'auto' : '600px', display: 'flex', flexDirection: 'column' }}
    >
      {!hasConditions && (
        <Stack spacing="20px" sx={{ alignItems: 'flex-start' }}>
          <Typography variant="h5">추천 시간</Typography>
          <Stack alignItems="center" spacing="20px" sx={{ pt: '100px', pb: '100px', px: '40px', width: '100%' }}>
            <EmptyScheduleCalendarIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 500,
                color: 'grey.500',
                textAlign: 'center',
                lineHeight: 1.467,
                letterSpacing: '0.144px',
              }}
            >
              참석 인원과 시간 조건을 설정하면
              <br />
              가능한 시간을 추천해 드려요
            </Typography>
          </Stack>
        </Stack>
      )}

      {hasConditions && (
        <RecommendedTimeCard
          scenario={cardScenario}
          slots={slots}
          selectedKeys={selectedSlotKeys}
          onToggleSlot={handleToggleSlot}
        />
      )}
    </CardContainer>
  );

  const calendarCard = hasConditions ? (
    <CardContainer key="calendar" variant="elevation" padding="card" radius="card">
      <CalendarAvailabilityCard
        scenario={cardScenario}
        days={days}
        hours={hours}
        cellStates={cellStates}
        events={calendarEvents}
        clickableKeys={clickableCellKeys}
        onCellClick={handleCalendarCellClick}
      />
    </CardContainer>
  ) : null;

  const nextButtonRow = (
    <Stack key="next" direction="row" justifyContent="flex-end">
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={!hasConditions || selectedSlotKeys.size === 0}
        onClick={onNext}
      >
        다음
      </Button>
    </Stack>
  );

  return (
    <CardPageLayout
      title="미팅 일정"
      sx={sx}
      left={leftCard}
      right={[scheduleCard, calendarCard, nextButtonRow].filter(Boolean)}
    />
  );
}
