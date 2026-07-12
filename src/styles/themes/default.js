/**
 * Default Theme
 *
 * 프로젝트의 기본 디자인 토큰을 정의하는 표준 테마입니다.
 * 피그마의 Design Tokens / Variables와 동일한 역할입니다.
 *
 * ## 핵심 철학 (ElevenLabs 스타일 기반, 밋핏 디자인 반영)
 * - **Warm Neutral**: 웜 그레이 텍스트 + 흰색/스톤 배경
 * - **Pill Buttons**: contained 버튼은 완전 라운드(9999px), 카드는 16px
 * - **Ink Black**: Primary 색상 #000000 (검정)
 * - **Thin Headings**: 헤딩은 Pretendard, 얇은 굵기(300)가 브랜드 시그니처
 */

import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// ============================================================
// 0. Primitive Tokens (프리미티브 토큰)
// ============================================================
// 이름 있는 컬러 스케일. 시멘틱 토큰(palette)은 여기서 값을 가져다 쓰기만 하고,
// 실제 hex 값은 이 객체 안에서만 관리한다 (Figma Variables의 Primitive Collection과 동일한 역할).
const primitives = {
  // Ink — 밋핏 디자인의 웜 블랙/그레이 스케일
  ink: {
    0: '#FFFFFF',
    50: '#F5F2EF',   // stone, 웜 배경
    100: '#E5E5E5',  // border
    300: '#9A938A',  // muted, disabled 텍스트
    500: '#777169',  // secondary 텍스트
    700: '#4E4E4E',  // secondary 텍스트(진한 톤)
    800: '#2B2B2B',
    900: '#000000',  // ink black, CTA 버튼
  },
  // Maroon — 필수 표시 / 에러 상태 전용 액센트
  maroon: {
    300: '#C0584D',
    500: '#A13D33',
    700: '#7A2E26',
  },
};

// ============================================================
// 1. Color Tokens (색상 토큰, Semantic)
// ============================================================
const palette = {
  mode: 'light',
  // 브랜드 색상
  primary: {
    light: primitives.ink[800],
    main: primitives.ink[900],
    dark: primitives.ink[900],
    contrastText: primitives.ink[0],
  },
  secondary: {
    light: primitives.ink[300],
    main: primitives.ink[500],
    dark: primitives.ink[700],
    contrastText: primitives.ink[0],
  },

  // 상태 색상 (Feedback)
  error: {
    light: primitives.maroon[300],
    main: primitives.maroon[500],
    dark: primitives.maroon[700],
    contrastText: primitives.ink[0],
  },
  warning: {
    light: '#ff9800',
    main: '#ed6c02',
    dark: '#e65100',
    contrastText: '#FFFFFF',
  },
  success: {
    light: '#4caf50',
    main: '#2e7d32',
    dark: '#1b5e20',
    contrastText: '#FFFFFF',
  },
  info: {
    light: '#03a9f4',
    main: '#0288d1',
    dark: '#01579b',
    contrastText: '#FFFFFF',
  },

  // 텍스트 색상
  text: {
    primary: primitives.ink[900],
    secondary: primitives.ink[700],
    disabled: primitives.ink[300],
  },

  // 배경 색상
  background: {
    default: primitives.ink[0],
    paper: primitives.ink[0],
    stone: primitives.ink[50], // 웜 톤 배경 (뱃지, 강조 영역 등)
  },

  // 구분선
  divider: primitives.ink[100],

  // 액션 상태
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },

  // Grey 스케일
  grey: {
    50: grey[50],
    100: grey[100],
    200: grey[200],
    300: grey[300],
    400: grey[400],
    500: grey[500],
    600: grey[600],
    700: grey[700],
    800: grey[800],
    900: grey[900],
  },
};

// ============================================================
// 2. Typography Tokens (타이포그래피 토큰)
// ============================================================
const typography = {
  // 기본 폰트 패밀리
  fontFamily: [
    '"Pretendard Variable"',
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    '"Helvetica Neue"',
    '"Segoe UI"',
    '"Apple SD Gothic Neo"',
    '"Noto Sans KR"',
    '"Malgun Gothic"',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    'sans-serif',
  ].join(','),

  // 헤딩 폰트 패밀리 (얇은 굵기의 Pretendard가 브랜드 시그니처)
  headingFontFamily: '"Pretendard Variable", Pretendard, sans-serif',

  // 폰트 크기 기준
  fontSize: 14,
  htmlFontSize: 16,

  // 폰트 굵기
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  // 헤딩 스타일 (ElevenLabs 타입 스케일 — display-hero/section/card 등 role 토큰 반영)
  h1: {
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 300,
    fontSize: '3rem',        // 48px — display-hero
    lineHeight: 1.08,
    letterSpacing: '-0.96px',
  },
  h2: {
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 300,
    fontSize: '2.25rem',     // 36px — section
    lineHeight: 1.17,
    letterSpacing: '0',
  },
  h3: {
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 300,
    fontSize: '2rem',        // 32px — card
    lineHeight: 1.13,
    letterSpacing: '0',
  },
  h4: {
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 500,
    fontSize: '1.5rem',      // 24px
    lineHeight: 1.3,
    letterSpacing: '0',
  },
  h5: {
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 400,
    fontSize: '1.25rem',     // 20px — body-lg
    lineHeight: 1.35,
    letterSpacing: '0',
  },
  h6: {
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 700,
    fontSize: '1.125rem',    // 18px — 섹션 타이틀(예: "미팅 정보", "참석자")
    lineHeight: 1.4,
    letterSpacing: '0',
  },

  // 본문 스타일
  body1: {
    fontSize: '1rem',        // 16px — body-std
    lineHeight: 1.5,
    letterSpacing: '0.16px',
  },
  body2: {
    fontSize: '0.875rem',    // 14px — caption 역할과 공유
    lineHeight: 1.43,
    letterSpacing: '0.14px',
  },

  // 부제목
  subtitle1: {
    fontSize: '1rem',        // 16px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  subtitle2: {
    fontSize: '0.875rem',    // 14px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },

  // 기타
  button: {
    fontSize: '0.9375rem',   // 15px — nav/button
    fontWeight: 500,
    lineHeight: 1.47,
    letterSpacing: '0.15px',
    textTransform: 'none',   // 대문자 변환 비활성화
  },
  caption: {
    fontSize: '0.875rem',    // 14px — caption
    lineHeight: 1.43,
    letterSpacing: '0.14px',
  },
  overline: {
    fontSize: '0.875rem',    // 14px — button-upper
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '0.7px',
    textTransform: 'uppercase',
  },
};

// ============================================================
// 3. Spacing Token (간격 토큰)
// ============================================================
const spacing = 8; // 기본 단위: 8px

// ============================================================
// 4. Shape Token (모양 토큰)
// ============================================================
const shape = {
  borderRadius: 12, // 기본값 — 드롭다운/인풋 등 소형 컨테이너 (--radius-md)
};

// ============================================================
// 5. Shadow Tokens (그림자 토큰)
// ============================================================
const customShadows = {
  none: 'none',
  sm: '0 0 12px rgba(0, 0, 0, 0.06)',
  md: '0 0 16px rgba(0, 0, 0, 0.08)',
  lg: '0 0 20px rgba(0, 0, 0, 0.10)',
  xl: '0 0 24px rgba(0, 0, 0, 0.12)',
};

// ============================================================
// 6. Breakpoints (브레이크포인트)
// ============================================================
const breakpoints = {
  values: {
    xs: 0,      // 모바일
    sm: 600,    // 태블릿 세로
    md: 900,    // 태블릿 가로
    lg: 1200,   // 데스크톱
    xl: 1536,   // 대형 데스크톱
  },
};

// ============================================================
// 7. Z-Index (레이어 순서)
// ============================================================
const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// ============================================================
// 8. Transitions (전환 효과)
// ============================================================
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// ============================================================
// 9. Component Overrides (컴포넌트 오버라이드)
// ============================================================
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: customShadows.lg,
      },
      elevation0: {
        boxShadow: customShadows.none,
      },
      elevation1: {
        boxShadow: customShadows.sm,
      },
      elevation2: {
        boxShadow: customShadows.md,
      },
      elevation3: {
        boxShadow: customShadows.lg,
      },
      elevation4: {
        boxShadow: customShadows.xl,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: shape.borderRadius,
        textTransform: 'none',
      },
      contained: {
        borderRadius: 9999, // pill 형태 (primary CTA)
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16, // --radius-card
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 4,
      },
    },
  },
};

// ============================================================
// Theme 생성
// ============================================================
const defaultTheme = createTheme({
  palette,
  typography,
  spacing,
  shape,
  breakpoints,
  zIndex,
  transitions,
  components,
});

// 커스텀 속성 추가 (타입 확장 없이 접근 가능하도록)
defaultTheme.customShadows = customShadows;

/**
 * 대시보드 스타일 설정 (Default)
 */
defaultTheme.dashboard = {
  style: 'default',
  iconStyle: 'outlined',
  iconWeight: 400,
  cardBorderRadius: 16,
  cardColors: [
    'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)',
    'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)',
    'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)',
    'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)',
    'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)',
    'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)',
  ],
  subCardColors: [
    'linear-gradient(to bottom, #FAFAFA 0%, #FAFAFA 100%)',
    'linear-gradient(to bottom, #FAFAFA 0%, #FAFAFA 100%)',
    'linear-gradient(to bottom, #FAFAFA 0%, #FAFAFA 100%)',
    'linear-gradient(to bottom, #FAFAFA 0%, #FAFAFA 100%)',
    'linear-gradient(to bottom, #FAFAFA 0%, #FAFAFA 100%)',
    'linear-gradient(to bottom, #FAFAFA 0%, #FAFAFA 100%)',
  ],
  textColor: palette.text.primary,
  textSecondary: palette.text.secondary,
  textShadow: '0 0 0 rgba(0, 0, 0, 0)',
  backdropFilter: 'blur(0px)',
  WebkitBackdropFilter: 'blur(0px)',
  border: '1px solid transparent',
  borderColor: 'transparent',
  shadow: customShadows.lg,
  subBorder: '1px solid rgba(0, 0, 0, 0.06)',
  subShadow: '0 0 0 rgba(0, 0, 0, 0)',
  subBackdropFilter: 'blur(0px)',
  subBorderRadius: 12,
  dividerColor: '#e5e5e5',
  progressHeight: 6,
  progressTrackColor: 'rgba(0, 0, 0, 0.08)',
  progressBarColor: palette.primary.main,
  progressGradient: false,
  progressBorderRadius: 9999,
  background: '#FFFFFF',
  atmosphere: 'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%)',
  atmosphereOpacity: 0,
  accentColor: palette.primary.main,
  accentColors: {
    wind: '#4DB6AC',
    humidity: '#FFB74D',
    uvIndex: '#FF8A65',
    pressure: '#64B5F6',
  },
  blobs: null,
};

export default defaultTheme;

// 개별 토큰 내보내기 (문서화용)
export {
  primitives,
  palette,
  typography,
  spacing,
  shape,
  customShadows,
  breakpoints,
  zIndex,
  transitions,
  components,
};
