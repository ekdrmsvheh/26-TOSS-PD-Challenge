# Components

Vibe Dictionary 텍소노미 v0.4 기반 분류. 번호는 텍소노미 카테고리 번호.

## 참조 문서

- 전체 텍소노미: `.claude/skills/component-work/resources/taxonomy-v0.4.md`
- 빠른 인덱스: `.claude/skills/component-work/resources/taxonomy-index.md`

새 컴포넌트 생성 시 위 문서에서 해당 카테고리 번호와 컴포넌트 원형을 확인한 후 구현할 것.

---

## 1. Typography — 텍스트 표현과 장식

- FitText: 컨테이너에 맞춤 텍스트 (`components/typography/FitText.jsx`)
- HighlightedTypography: 하이라이트 타이포그래피 (`components/typography/HighlightedTypography.jsx`)
- InlineTypography: 인라인 타이포그래피 (`components/typography/InlineTypography.jsx`)
- StretchedHeadline: 스트레치 헤드라인 (`components/typography/StretchedHeadline.jsx`)
- StyledParagraph: 스타일드 문단 (`components/typography/StyledParagraph.jsx`)
- Title: 타이틀 컴포넌트 (`components/typography/Title.jsx`)
- QuotedContainer: 인용 컨테이너 (`components/typography/QuotedContainer.jsx`)

## 2. Container — 시각적 경계와 그룹핑

- SectionContainer: 페이지 섹션 컨테이너. MUI Container 기반 (`components/container/SectionContainer.jsx`)
- CarouselContainer: 캐로셀 컨테이너 (`components/container/CarouselContainer.jsx`)
- RatioContainer: 비율 기반 컨테이너 (`components/container/RatioContainer.jsx`)

## 3. Card — 독립적 정보 단위

- CardContainer: 카드 기본 컨테이너. variant, padding, elevation (`components/card/CardContainer.jsx`)
- CustomCard: 미디어+콘텐츠 카드. vertical/horizontal/overlay 레이아웃 (`components/card/CustomCard.jsx`)
- ImageCard: 이미지 카드 (`components/card/ImageCard.jsx`)
- MoodboardCard: 무드보드 컬렉션 카드. 2x2 썸네일 그리드 (`components/card/MoodboardCard.jsx`)
- RecommendedSlotCard: 시간 후보 하나를 보여주는 카드. tier(primary/secondary/plain) 3단계 위계 — primary만 배경 채움+굵은 accent 보더+풀컬러 체크, secondary는 흰 배경+옅은 accent 보더, plain은 완전 무채색 (`components/card/RecommendedSlotCard.jsx`)
- RecommendedTimeCard: "추천 시간" 카드. RecommendedSlotCard를 3열 그리드로 배치(위치 기반 tier 자동 계산), "모든 후보 보기" 토글로 4번째 이후 슬롯 노출, scenario(recommend=blue/adjust=orange)별 기본 안내 문구 (`components/card/RecommendedTimeCard.jsx`)
- CalendarAvailabilityCard: "캘린더" 카드. 요일×시간 그리드(텍스트 라벨 없이 색으로만 상태 표현) + 범례 + "상세 일정 보기" 토글. 상세보기 ON 시 셀 안에 참석자별 일정이 펼쳐지고, 조정 원인이 되는 일정은 속이 빈 점 마커+강조색(#C37500)으로 표시 (`components/card/CalendarAvailabilityCard.jsx`)
- Card: MUI Card 컴포넌트 [MUI]

## 4. Media — 이미지, 비디오 표시

- AspectMedia: 비율 기반 미디어 컨테이너 (`components/media/AspectMedia.jsx`)
- ImageCarousel: 이미지 캐로셀 (`components/media/ImageCarousel.jsx`)
- ImageTransition: 이미지 트랜지션 효과 (`components/media/ImageTransition.jsx`)
- CarouselIndicator: 캐로셀 인디케이터 (`components/media/CarouselIndicator.jsx`)

## 5. Data Display — 구조화된 데이터 시각화

- Table: MUI Table 컴포넌트 [MUI]

## 6. In-page Navigation — 페이지 내 탐색

- CategoryTab: 카테고리 탭 (`components/in-page-navigation/CategoryTab.jsx`)
- Tabs: MUI Tabs 컴포넌트 [MUI]

## 7. Input & Control — 사용자 입력

- FileDropzone: 파일 드래그&드롭 영역 (`components/input/FileDropzone.jsx`)
- SearchBar: 검색 입력 바 (`components/input/SearchBar.jsx`)
- TagInput: 태그 입력 필드 (`components/input/TagInput.jsx`)
- SelectTrigger: 커스텀 드롭다운(캘린더 등) 진입점 버튼. 값 텍스트 + placeholder + 필수 표시, size="small"로 좁은 폼(조건 요약 카드 등)에 맞는 축소 크기 지원 (`components/input/SelectTrigger.jsx`)
- AttendeeRow: 미팅 참석자 행. 아바타(44)/이름(16)/역할/필수·권장·선택 레벨(정적 점 또는 onRoleLevelChange 전달 시 필수/선택 토글, 선택값=브랜드 블루)/주최자 뱃지/삭제 버튼. variant='bordered'(기본, 개별 보더 박스) | 'plain'(보더 없이 divider로 나열) (`components/input/AttendeeRow.jsx`)
- DateRangePicker: 캘린더 Popover. 좌측 프리셋 + 우측 월 달력, 종료일 미선택시 완료하면 하루로 확정 (`components/input/DateRangePicker.jsx`)
- AttendeePicker: 위로 열리는 동료 선택 Popover. 검색 + 다중선택 + 초기화/닫기/완료 (`components/input/AttendeePicker.jsx`)
- AttendeeSelectDialog: "참석 인원을 선택해 주세요" 모달. 헤더(원형 닫기)/본문(주최자 카드 + 검색 Autocomplete로 채우는 참석자 목록, AttendeeRow variant='plain'을 divider로 구분·필수/선택 토글·삭제)/그라디언트 푸터(선택 완료)로 구성. Figma "참석 인원 선택 모달" 대응 (`components/input/AttendeeSelectDialog.jsx`)
- PresetPopover: "프리셋 + 직접 입력 + 완료" 조건 편집 팝업 공통 셸. 프리셋 버튼은 즉시 반영, children 커스텀 입력은 "OO 적용" 버튼을 눌러야 반영 (`components/input/PresetPopover.jsx`)
- TimeSelectPopover: 문자열 값 하나를 고르는 검색 가능한 스크롤 리스트 Popover(시간·길이 등 짧은 라벨 목록에 범용). 단일 값 선택이라 항목 클릭 시 즉시 반영되고 팝업이 닫힘(완료 버튼 없음) (`components/input/TimeSelectPopover.jsx`)
- Button: MUI Button 컴포넌트 [MUI]
- Checkbox: MUI Checkbox 컴포넌트 [MUI]
- Select: MUI Select 컴포넌트 [MUI]
- Switch: MUI Switch 컴포넌트 [MUI]
- TextField: MUI TextField 컴포넌트 [MUI]

## 8. Layout — 공간 배치와 구조

- PhiSplit: 황금비 분할 레이아웃 (`components/layout/PhiSplit.jsx`)
- SplitScreen: 좌우 분할 레이아웃. ratio, stackAt, stackOrder 지원 (`components/layout/SplitScreen.jsx`)
- BentoGrid: 벤토 그리드 레이아웃 (`components/layout/BentoGrid.jsx`)
- LineGrid: 그리드 아이템 사이 1px 라인 자동 삽입 (`components/layout/LineGrid.jsx`)
- FullPageContainer: 전체 페이지 컨테이너 (`components/layout/FullPageContainer.jsx`)
- PageContainer: 반응형 페이지 컨테이너. PC maxWidth 고정, 모바일 100% (`components/layout/PageContainer.jsx`)
- AppShell: 반응형 앱 셸. GNB + 메인 콘텐츠 영역 (`components/layout/AppShell.jsx`)
- StickyAsideCenterLayout: 대칭 3열 그리드. sticky aside + 페이지 정중앙 콘텐츠 + 빈 대칭 칼럼 (`components/layout/StickyAsideCenterLayout.jsx`)
- CardPageLayout: 카드(흰 박스, CardContainer) 기반 화면 공통 콘텐츠 셸. max-width 1280px·좌우 40px/상단 80px 패딩, title이 있으면 타이틀-카드 갭 20px. left가 있으면 좌(1개 카드)+우(카드 스택) 2컬럼 분할(컬럼 갭 20px, 우측 스택 갭 12px), 없으면 children을 단일 컬럼으로 렌더링 (`components/layout/CardPageLayout.jsx`)
- Grid: MUI Grid 컴포넌트 [MUI]
- Masonry: MUI Masonry 컴포넌트 [MUI]

## 9. Overlay & Feedback — 맥락적 정보 표시

- Dialog: MUI Dialog 컴포넌트 [MUI]

## 10. Navigation (Global) — 페이지 간 이동

- GNB: 반응형 글로벌 네비게이션 바. 데스크탑 메뉴 / 모바일 Drawer (`components/navigation/GNB.jsx`)
- NavMenu: 네비게이션 메뉴 (`components/navigation/NavMenu.jsx`)
- SlidingHighlightMenu: 슬라이딩 하이라이트 메뉴. hover 시 layoutId 기반 인디케이터 이동, background/underline, horizontal/vertical (`components/navigation/SlidingHighlightMenu.jsx`)

## 11. KineticTypography (Interactive) — 텍스트 애니메이션 효과

- RandomRevealText: 랜덤 순서 blur 리빌 타이포그래피. Fisher-Yates 셔플 기반 (`components/kinetic-typography/RandomRevealText.jsx`)
- ScrambleText: 텍스트 스크램블 전환 효과. requestAnimationFrame 기반 (`components/kinetic-typography/ScrambleText.jsx`)
- ScrollRevealText: 스크롤 진행에 따른 텍스트 순차 리빌 (`components/kinetic-typography/ScrollRevealText.jsx`)

## 13. ContentTransition (Interactive) — 섹션 간 전환

- HorizontalScrollContainer: 세로 스크롤→가로 이동 변환 컨테이너. 픽셀 기반 DOM 측정, Framer Motion (`components/content-transition/HorizontalScrollContainer.jsx`)

## 12. Scroll (Interactive) — 스크롤 기반 효과

- VideoScrubbing: 스크롤 기반 비디오 스크러빙 (`components/scroll/VideoScrubbing.jsx`)
- ScrollScaleContainer: 뷰포트 노출 비율 연동 스케일 컨테이너. Framer Motion useScroll + useTransform (`components/scroll/ScrollScaleContainer.jsx`)

## 14. Motion (Interactive) — 스토리텔링 모션

- FadeTransition: 기본 opacity 전환 애니메이션. 등장/퇴장 페이드 + 방향 슬라이드, IntersectionObserver 자동 트리거 (`components/motion/FadeTransition.jsx`)
- PerspectiveTransition: 3D 원근 회전 전환. 뒤로 누워있다가 세워지는 효과, CSS perspective + rotateX, IntersectionObserver 자동 트리거 (`components/motion/PerspectiveTransition.jsx`)
- MarqueeContainer: 무한 루프 수평 흐름 컨테이너. CSS keyframes 기반 (`components/motion/MarqueeContainer.jsx`)

## 15. DynamicColor (Interactive) — 동적 색상 변화

- GradientOverlay: Three.js WebGL 스크롤 반응형 그라데이션 배경. Simplex Noise + 필름 그레인 (`components/dynamic-color/GradientOverlay.jsx`)
- GradientOverlayDynamic: Next.js 동적 import 래퍼 (ssr: false). 페이지에서 사용 시 이것을 import (`components/dynamic-color/GradientOverlayDynamic.jsx`)

---

## Common (유틸리티)

- Indicator: 범용 인디케이터 (`common/ui/Indicator.jsx`)
- StatusDot: 색상 점 + 라벨(+숫자) 상태 인디케이터 (`common/ui/StatusDot.jsx`)
- Placeholder: 스토리 예제용 FPO 플레이스홀더 시스템. Box/Image/Media/Text/Line/Paragraph/Card 서브컴포넌트 (`common/ui/Placeholder.jsx`)
- FilterBar: 필터 바 (`components/templates/FilterBar.jsx`)
- IntroView: 밋핏의 인트로(랜딩) 화면. 사이트 진입 시 가장 먼저 보여주는 화면 — 제품 소개 카피(2가지 시나리오 안내) + "시작하기" CTA로 플로우 진입 (`components/templates/IntroView.jsx`)
- AvailableScheduleView: 밋핏의 "미팅 일정" 화면(사이트 진입 시 기본 화면). CardPageLayout(좌1개+우스택)로 구성 — 미팅 조건 카드(참여 인원 편집은 AttendeeSelectDialog로 위임) + 추천 시간 카드(RecommendedTimeCard) + 캘린더 카드(CalendarAvailabilityCard) (`components/templates/AvailableScheduleView.jsx`)
- MeetingInfoView: 밋핏의 "미팅 정보 작성" 화면(플로우 2단계). CardPageLayout(좌1개+우스택)로 구성 — 좌측 미팅 조건 카드(참여 인원 표시 + 추천 시간 후보 선택)와 우측 기본 정보/미팅 목적(AI 자동 생성 데모)/참석자별 참석 요청 이유/응답 요청(SelectTrigger) 폼 (`components/templates/MeetingInfoView.jsx`)
- AttendeeReviewView: 밋핏의 "일정 확인 후 응답" 화면(참여자 역할 전용, Figma node-id 339-47258 기준). CardPageLayout 2컬럼 분할 모드로 구성 — 좌측 "미팅 정보" 카드(미팅 목적/나의 역할 배지+사유/참석 인원 아바타), 우측 "가능한 시간을 알려주세요" 카드(후보 3개마다 가능·비선호·조정 필요·불가 4지 응답 + 선택 메모), 전체 응답 완료 시에만 "응답 보내기" 활성, 제출 후 완료 상태 표시 (`components/templates/AttendeeReviewView.jsx`)
- ReviewRequestSentView: 밋핏의 "일정 검토 요청 발송" 화면(플로우 3단계). CardPageLayout 단일 컬럼 모드로 구성 — 발송 완료 체크 아이콘 + 안내 문구 + "응답 현황 보기" CTA만 제공하는 전환용 확인 화면 (`components/templates/ReviewRequestSentView.jsx`)
- ResponseStatusView: 밋핏의 "응답 현황" 화면(플로우 4단계). CardPageLayout(좌1개 요약+우스택)로 구성 — 좌측 응답률/응답 기한/미응답자/필수 참석자 확인 필요 알림 + 리마인드 버튼, 우측 참석자별 응답 카드(사람별 후보 3개 응답 칩)와 날짜별 투표 결과 카드(StatusDot으로 후보별 상태 집계, 카드 클릭으로 확정 후보 라디오 선택) + 하단 확정 CTA(선택한 후보로 "미팅 확정하기", 필수 참석자 미응답·조정 필요 남아있으면 경고 문구) (`components/templates/ResponseStatusView.jsx`)
- MeetingConfirmedView: 밋핏의 "미팅 확정" 화면(플로우 5단계). CardPageLayout 단일 컬럼 모드로 구성 — 확정 체크 아이콘 + "확정된 일정" 카드(날짜·시간 강조 + 회의 목적)와 "참석자" 카드(확정 후보 기준 참석자별 최종 응답 상태 칩, 비선호·불가도 숨기지 않고 노출) + "참석자에게 확정 공유하기" CTA (`components/templates/MeetingConfirmedView.jsx`)
- TestFlowShell: 과제 제출용 테스트 하네스 셸. 좌측 고정 사이드바(300px) — "홈으로 돌아가기"(IntroView로 복귀), "시나리오" 라디오(A/B, 데모용), "플로우" 네비게이션(주최자/참석자 섹션별 아이템, 클릭 시 역할·단계 직접 전환, default/hover/pressed·selected/done 상태 구분) + 하단 "처음부터 다시 해보기" 버튼 + 메인 콘텐츠 슬롯 (`components/templates/TestFlowShell.jsx`)
