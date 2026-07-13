# MUI Custom Theme (SHOULD)

MUI 커스텀 테마 설정 규칙

## 테마 파일 관리

- 커스텀 테마는 별도의 파일로 관리한다
- 위치: `src/styles/themes/default.js`
- 값의 출처: `Documents/DESIGN_MD/oh-my-design/TOSS/DESIGN.md` (Toss 디자인 시스템 리컨실 문서)

## Typography

### 본문 / 헤딩
- **Toss Product Sans**가 원본이지만 라이선스상 로드 불가 — 실제 렌더링은 이미 로드된 **Pretendard**가 담당한다 (`fontFamily`에 Toss Product Sans를 1순위로 명시만 해두고 폴백으로 Pretendard 사용)
- 헤딩과 본문이 같은 폰트 패밀리를 쓴다 — **굵기로만 위계**를 준다 (Toss는 별도 헤딩 서체를 안 씀)
- 굵기는 세 가지만 사용: **400(본문) / 600(강조) / 700(헤딩)**

## Color

### Primitive → Semantic 구조 (CRITICAL)

hex 값은 `primitives` 객체(`src/styles/themes/default.js` 최상단)에서만 관리하고,
`palette`(시멘틱 토큰)는 그 값을 참조만 한다. 컴포넌트에서 새 색상이 필요하면
1) `primitives`에 이름 있는 스케일로 추가 → 2) `palette`에서 시멘틱 슬롯으로 매핑 →
3) 컴포넌트는 `'primary.main'`, `'grey.700'`처럼 시멘틱 경로만 참조한다.
컴포넌트 코드에 hex를 직접 쓰지 않는다.

```jsx
const primitives = {
  grey: { 100: '#F2F4F6', 600: '#6B7684', 900: '#191F28' /* ... */ },
  blue: { 50: '#E8F3FF', 500: '#3182F6', 600: '#2272EB' },
  red: { 500: '#F04452' },
};

const palette = {
  primary: { main: primitives.blue[500] },   // Toss Blue — 인터랙션 전용, 장식 금지
  secondary: { main: primitives.grey[700] }, // 강조 텍스트/보조 액션
  error: { main: primitives.red[500] },      // 에러, 파괴적 액션
};
```

### 핵심 원칙 — "Blue is interaction, not decoration"

`primary.main`(Toss Blue `#3182F6`)은 **탭 가능한 요소에만** 사용한다. 일러스트, 장식,
보더, 헤더 배경에는 절대 쓰지 않는다. 로고/마케팅용 Brand Blue(`#0064FF`)와는 다른
색이니 혼동하지 말 것 — UI에는 항상 `primary.main`(`#3182F6`)을 쓴다.

## Elevation

Toss는 **단일 레이어의 순수 블랙 그림자**만 쓴다 (컬러 그림자, 다중 레이어 없음).

```jsx
customShadows: {
  sm: '0px 1px 3px rgba(0, 0, 0, 0.06)',   // subtle — 리스트 아이템 구분
  md: '0px 2px 8px rgba(0, 0, 0, 0.08)',   // standard — 카드, 콘텐츠 패널
  lg: '0px 4px 12px rgba(0, 0, 0, 0.12)',  // elevated — 드롭다운, 팝오버
  xl: '0px 8px 24px rgba(0, 0, 0, 0.16)',  // modal — 바텀시트, 다이얼로그
}
```

## Border Radius

단일 값이 아니라 컴포넌트 종류별로 다르게 적용한다. **pill 버튼은 안 씀** (토글만 예외).

- 기본(`shape.borderRadius`): **8px** — 인풋(TextField/Select/커스텀 SelectTrigger/검색창 등 모든 입력 컨트롤), 소형 버튼
- Card: **12px**
- Button: **12px** (Figma Button/Solid 기준, 카드와 동일, pill 아님)
- Chip/Badge: **12px**
- 시트/모달: **16px**
- `CardPageLayout`/`PanelPageLayout`의 좌/우 2컬럼 흰 박스(`CardContainer radius="card"`): **20px**
- 토글: **9999px** (pill, 유일한 예외)

인풋류는 `MuiOutlinedInput` 테마 오버라이드로 8px가 고정돼 있다. 컴포넌트에서 `.MuiOutlinedInput-root`나
커스텀 트리거에 별도 px를 하드코딩하지 말고 이 값을 그대로 상속받게 둘 것.

### Button — 그림자 없음 + size="large" CTA

Figma Button/Solid에는 box-shadow가 없다. `MuiButton`은 `defaultProps.disableElevation: true`로
모든 상태(기본/hover/active)의 그림자를 제거해 둔다. 개별 버튼에서 boxShadow를 다시 넣지 말 것.

페이지 하단의 큰 CTA(제출/확정/다음 등)는 `size="large"`를 지정해 `sizeLarge` 오버라이드
(padding `12px 28px`, fontSize 16px, fontWeight 600, lineHeight 1.5)를 그대로 상속받게 하고,
`sx`에 `px`/`py`/`fontWeight`를 따로 하드코딩하지 않는다.

```jsx
shape: {
  borderRadius: 8
}
```

## 테마 적용 예시

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3182F6' },
    secondary: { main: '#4E5968' },
    error: { main: '#F04452' },
  },
  typography: {
    fontFamily: '"Toss Product Sans", "Pretendard Variable", sans-serif',
    h1: {
      fontFamily: '"Toss Product Sans", "Pretendard Variable", sans-serif',
      fontWeight: 700,
    },
    // ...
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 앱 내용 */}
    </ThemeProvider>
  );
}
```
