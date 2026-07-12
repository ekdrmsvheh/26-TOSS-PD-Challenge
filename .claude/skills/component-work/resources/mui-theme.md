# MUI Custom Theme (SHOULD)

MUI 커스텀 테마 설정 규칙

## 테마 파일 관리

- 커스텀 테마는 별도의 파일로 관리한다
- 위치: `src/styles/theme.js` 또는 유사 경로

## Typography

### 본문
- **Pretendard Variable** 버전을 웹폰트로 사용

### Headline
- **영어/한글 공통**: Pretendard, 얇은 weight(300)가 브랜드 시그니처 (Outfit 사용 안 함)

## Color

### Primitive → Semantic 구조 (CRITICAL)

hex 값은 `primitives` 객체(`src/styles/themes/default.js` 최상단)에서만 관리하고,
`palette`(시멘틱 토큰)는 그 값을 참조만 한다. 컴포넌트에서 새 색상이 필요하면
1) `primitives`에 이름 있는 스케일로 추가 → 2) `palette`에서 시멘틱 슬롯으로 매핑 →
3) 컴포넌트는 `'primary.main'`, `'background.stone'`처럼 시멘틱 경로만 참조한다.
컴포넌트 코드에 hex를 직접 쓰지 않는다.

```jsx
const primitives = {
  ink: { 0: '#FFFFFF', 900: '#000000' /* ... */ },
  maroon: { 500: '#A13D33' /* ... */ },
};

const palette = {
  primary: { main: primitives.ink[900] },      // 검정 (CTA 버튼)
  secondary: { main: primitives.ink[500] },    // 웜 그레이 (muted)
  error: { main: primitives.maroon[500] },     // 필수(*) 표시, 에러 상태
};
```

## Elevation

Paper에 기본적으로 사용되는 elevation의 box shadow 설정:

- x, y offset: 0
- opacity 값: 낮춤
- blur 값: 높임 (dimmed shadow)

```jsx
shadows: [
  'none',
  '0 0 8px rgba(0, 0, 0, 0.08)',
  '0 0 16px rgba(0, 0, 0, 0.08)',
  // ...
]
```

## Border Radius

단일 값이 아니라 컴포넌트 종류별로 다르게 적용한다.

- 기본(`shape.borderRadius`): **12px** — 드롭다운/인풋 등 소형 컨테이너
- Card: **16px**
- Button(contained): **9999px** (완전 pill 형태)
- Chip: **4px**

```jsx
shape: {
  borderRadius: 12
}
```

## 테마 적용 예시

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#000000' },
    secondary: { main: '#777169' },
    error: { main: '#a13d33' },
  },
  typography: {
    fontFamily: 'Pretendard Variable, sans-serif',
    h1: {
      fontFamily: 'Pretendard Variable, sans-serif',
      fontWeight: 300,
    },
    // ...
  },
  shape: {
    borderRadius: 12,
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
