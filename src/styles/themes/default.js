/**
 * Default Theme
 *
 * 프로젝트의 기본 디자인 토큰을 정의하는 표준 테마입니다.
 * 피그마의 Design Tokens / Variables와 동일한 역할입니다.
 *
 * ## 핵심 철학 (Toss 디자인 시스템 기반 — Documents/DESIGN_MD/oh-my-design/TOSS/DESIGN.md 참조)
 * - **Blue is interaction, not decoration**: Primary 색상은 오직 탭 가능한 요소에만 사용
 * - **Bold Headings**: 헤딩은 700 굵기 — 얇은 헤딩 대신 명확하고 신뢰감 있는 타이포
 * - **Restraint over depth**: 그림자는 단일 레이어, 낮은 opacity의 순수 블랙만 사용
 * - **8~20px radius**: pill 버튼 없음 — 인풋 8px, 카드/버튼 12px, 시트/모달 16px, 카드(2컬럼 레이아웃 흰 박스) 20px, 토글만 pill
 * - **버튼은 그림자 없음**: `MuiButton`은 `disableElevation`으로 고정 — Figma Button/Solid에 box-shadow가 없음
 */

import { createTheme } from '@mui/material/styles';

// ============================================================
// 0. Primitive Tokens (프리미티브 토큰)
// ============================================================
// 이름 있는 컬러 스케일. 시멘틱 토큰(palette)은 여기서 값을 가져다 쓰기만 하고,
// 실제 hex 값은 이 객체 안에서만 관리한다 (Figma Variables의 Primitive Collection과 동일한 역할).
// 출처: Documents/DESIGN_MD/oh-my-design/TOSS/DESIGN.md (2026-06-08 추출본)
const primitives = {
  // Grey — Toss 10단계 뉴트럴 스케일 (웜 언더톤)
  grey: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F2F4F6',  // surface, 카드/비활성 배경
    200: '#E5E8EB',  // 기본 보더
    300: '#D1D6DB',  // 강조 보더
    400: '#B0B8C1',  // placeholder, 비활성 아이콘
    500: '#8B95A1',  // 캡션/보조 라벨
    600: '#6B7684',  // 본문 텍스트
    700: '#4E5968',  // 강조 본문, 서브헤딩
    800: '#333D4B',  // 강한 라벨, 내비게이션 텍스트
    900: '#191F28',  // 헤딩, 가장 진한 텍스트
  },
  // Blue — Primary 인터랙션 컬러 (UI Blue. 로고용 Brand Blue #0064FF와는 다름)
  blue: {
    50: '#E8F3FF',
    100: '#C9E2FF',
    200: '#90C2FF',
    300: '#64A8FF',
    400: '#4593FC',
    500: '#3182F6',  // primary main
    600: '#2272EB',  // hover/pressed
    700: '#1B64DA',
    800: '#1957C2',
    900: '#194AA6',
  },
  // Red — Error/Danger 상태
  red: {
    50: '#FFEEEE',
    100: '#FFD4D6',
    200: '#FEAFB4',
    300: '#FB8890',
    400: '#F66570',
    500: '#F04452',  // error main
    600: '#E42939',
    700: '#D22030',
    800: '#BC1B2A',
    900: '#A51926',
  },
  // Orange — Warning 상태
  orange: {
    50: '#FFF3E0',
    100: '#FFE0B0',
    200: '#FFCD80',
    300: '#FFBD51',
    400: '#FFA927',
    500: '#FE9800',  // warning main
    600: '#FB8800',
    700: '#F57800',
    800: '#ED6700',
    900: '#E45600',
  },
  // Yellow — 현재 시멘틱 미연결, 필요 시 강조/하이라이트 용도로 연결
  yellow: {
    50: '#FFF9E7',
    100: '#FFEFBF',
    200: '#FFE69B',
    300: '#FFDD78',
    400: '#FFD158',
    500: '#FFC342',
    600: '#FFB331',
    700: '#FAA131',
    800: '#EE8F11',
    900: '#DD7D02',
  },
  // Green — Success 상태
  green: {
    50: '#F0FAF6',
    100: '#AEEFD5',
    200: '#76E4B8',
    300: '#3FD599',
    400: '#15C47E',
    500: '#03B26C',  // success main
    600: '#02A262',
    700: '#029359',
    800: '#028450',
    900: '#027648',
  },
  // Teal — Info 상태 (Blue는 primary 전용이라 정보성 톤은 Teal로 분리)
  teal: {
    50: '#EDF8F8',
    100: '#BCE9E9',
    200: '#89D8D8',
    300: '#58C7C7',
    400: '#30B6B6',
    500: '#18A5A5',
    600: '#109595',
    700: '#0C8585',
    800: '#097575',
    900: '#076565',
  },
  // Purple — 현재 시멘틱 미연결, 필요 시 프로모션/뱃지 용도로 연결
  purple: {
    50: '#F9F0FC',
    100: '#EDCCF8',
    200: '#DA9BEF',
    300: '#C770E4',
    400: '#B44BD7',
    500: '#A234C7',
    600: '#9128B4',
    700: '#8222A2',
    800: '#73228E',
    900: '#65237B',
  },
  // Dim — Toss "Grey 투명도" 스크림/오버레이 전용 스케일 (hex+opacity를 rgba로 환산해 등록)
  dim: {
    50: 'rgba(0, 23, 51, 0.02)',
    100: 'rgba(2, 32, 71, 0.05)',
    200: 'rgba(0, 27, 55, 0.1)',
    300: 'rgba(0, 29, 58, 0.18)',
    400: 'rgba(0, 25, 54, 0.31)',
    500: 'rgba(3, 24, 50, 0.46)',
    600: 'rgba(0, 19, 43, 0.58)',
    700: 'rgba(3, 18, 40, 0.7)',
    800: 'rgba(0, 12, 30, 0.8)',
    900: 'rgba(2, 9, 19, 0.91)',
  },
  // Line — 카드 내부 구분선(Divider) 전용 톤. Figma "Line/Normal/Neutral" 변수와 동일
  // (#70737C 16% 투명도) — 컴포넌트 보더에 쓰는 grey[200](#E5E8EB, 불투명)보다 옅다
  line: {
    neutral: 'rgba(112, 115, 124, 0.16)',
  },
};

// ============================================================
// 1. Color Tokens (색상 토큰, Semantic)
// ============================================================
const palette = {
  mode: 'light',
  // 브랜드 색상 — Blue는 오직 인터랙션(탭 가능한 요소)에만 사용, 장식 금지
  primary: {
    light: primitives.blue[50],
    main: primitives.blue[500],
    dark: primitives.blue[600],
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: primitives.grey[500],
    main: primitives.grey[700],
    dark: primitives.grey[800],
    contrastText: '#FFFFFF',
  },

  // 상태 색상 (Feedback) — light/main/dark는 각 primitive 스케일의 100/500/700(800) 단계를 사용
  error: {
    light: primitives.red[100], // Toss Weak/Danger 배경 톤
    main: primitives.red[500],
    dark: primitives.red[700], // Toss Weak/Danger 배지 텍스트
    contrastText: '#FFFFFF',
  },
  warning: {
    light: primitives.orange[100],
    main: primitives.orange[500],
    dark: primitives.orange[800],
    contrastText: '#FFFFFF',
  },
  success: {
    light: primitives.green[100],
    main: primitives.green[500],
    dark: primitives.green[800],
    contrastText: '#FFFFFF',
  },
  info: {
    light: primitives.teal[100],
    main: primitives.teal[500],
    dark: primitives.teal[700],
    contrastText: '#FFFFFF',
  },

  // 텍스트 색상
  text: {
    primary: primitives.grey[900],   // 헤딩, 가장 진한 텍스트
    secondary: primitives.grey[600], // 본문/설명 텍스트
    disabled: primitives.grey[400],  // placeholder
  },

  // 배경 색상
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    stone: primitives.grey[100], // 서브 배경 (뱃지, 강조 영역 등)
  },

  // 구분선
  divider: primitives.grey[200],

  // 액션 상태
  action: {
    active: 'rgba(25, 31, 40, 0.54)',
    hover: 'rgba(25, 31, 40, 0.04)',
    selected: 'rgba(25, 31, 40, 0.08)',
    disabled: 'rgba(25, 31, 40, 0.26)',
    disabledBackground: 'rgba(25, 31, 40, 0.12)',
    focus: 'rgba(25, 31, 40, 0.12)',
  },

  // Grey 스케일
  grey: {
    50: primitives.grey[50],
    100: primitives.grey[100],
    200: primitives.grey[200],
    300: primitives.grey[300],
    400: primitives.grey[400],
    500: primitives.grey[500],
    600: primitives.grey[600],
    700: primitives.grey[700],
    800: primitives.grey[800],
    900: primitives.grey[900],
  },
};

// ============================================================
// 2. Typography Tokens (타이포그래피 토큰)
// ============================================================
const typography = {
  // 기본 폰트 패밀리
  // Toss Product Sans는 라이선스상 로드 불가 — 1순위로 명시만 하고(향후 대응),
  // 실제로는 이미 로드된 Pretendard가 렌더링을 담당한다.
  fontFamily: [
    '"Toss Product Sans"',
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

  // 헤딩 폰트 패밀리 (Toss는 헤딩도 본문과 같은 패밀리 — 굵기로만 위계를 준다)
  headingFontFamily: '"Toss Product Sans", "Pretendard Variable", Pretendard, sans-serif',

  // 폰트 크기 기준
  fontSize: 14,
  htmlFontSize: 16,

  // 폰트 굵기 — Toss는 400(본문)/600(강조)/700(헤딩) 세 가지만 사용
  fontWeightLight: 400,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,

  // 헤딩 스타일 (Toss 타입 스케일 — display-hero/display-lg/heading-lg/heading/subtitle 반영)
  h1: {
    fontFamily: '"Toss Product Sans", "Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 700,
    fontSize: '1.875rem',    // 30px — display-hero
    lineHeight: 1.33,
    letterSpacing: '0',
  },
  h2: {
    fontFamily: '"Toss Product Sans", "Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 700,
    fontSize: '1.625rem',    // 26px — display-lg
    lineHeight: 1.38,
    letterSpacing: '0',
  },
  h3: {
    fontFamily: '"Toss Product Sans", "Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 700,
    fontSize: '1.375rem',    // 22px — heading-lg
    lineHeight: 1.36,
    letterSpacing: '0',
  },
  h4: {
    fontFamily: '"Toss Product Sans", "Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 600,
    fontSize: '1.25rem',     // 20px — heading
    lineHeight: 1.40,
    letterSpacing: '0',
  },
  h5: {
    fontFamily: '"Toss Product Sans", "Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',        // 16px — subtitle
    lineHeight: 1.50,
    letterSpacing: '0',
  },
  h6: {
    fontFamily: '"Toss Product Sans", "Pretendard Variable", Pretendard, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',        // 16px — subtitle (섹션 타이틀용)
    lineHeight: 1.50,
    letterSpacing: '0',
  },

  // 본문 스타일
  body1: {
    fontSize: '1rem',        // 16px — body-lg
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  body2: {
    fontSize: '0.875rem',    // 14px — body
    fontWeight: 400,
    lineHeight: 1.57,
    letterSpacing: '0',
  },

  // 부제목
  subtitle1: {
    fontSize: '1rem',        // 16px — subtitle
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  subtitle2: {
    fontSize: '0.875rem',    // 14px — body, 강조용
    fontWeight: 600,
    lineHeight: 1.57,
    letterSpacing: '0',
  },

  // 기타
  button: {
    fontSize: '0.9375rem',   // 15px — 버튼 medium 사이즈 기준
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0',
    textTransform: 'none',   // 대문자 변환 비활성화 — Toss는 버튼에 마침표/대문자 안 씀
  },
  caption: {
    fontSize: '0.75rem',     // 12px — caption (타임스탬프, 잔글씨)
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  overline: {
    fontSize: '0.75rem',     // 12px
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: '0',
    textTransform: 'none',   // Toss는 장식적인 대문자 라벨을 쓰지 않음
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
  borderRadius: 8, // 기본값 — Toss "Standard" (인풋, 소형 버튼)
};

// ============================================================
// 5. Shadow Tokens (그림자 토큰)
// ============================================================
// Toss는 단일 레이어의 순수 블랙 그림자만 사용 (컬러 그림자, 다중 레이어 없음)
const customShadows = {
  none: 'none',
  sm: '0px 1px 3px rgba(0, 0, 0, 0.06)',   // subtle — 리스트 아이템 구분
  md: '0px 2px 8px rgba(0, 0, 0, 0.08)',   // standard — 카드, 콘텐츠 패널
  lg: '0px 4px 12px rgba(0, 0, 0, 0.12)',  // elevated — 드롭다운, 팝오버
  xl: '0px 8px 24px rgba(0, 0, 0, 0.16)',  // modal — 바텀시트, 다이얼로그
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
    defaultProps: {
      disableElevation: true, // Toss 버튼은 그림자 없음 (Figma Button/Solid 기준)
    },
    styleOverrides: {
      root: {
        borderRadius: 12, // Toss 버튼 반경 (Figma Button/Solid 기준, 카드와 동일, pill 아님)
        textTransform: 'none',
      },
      sizeLarge: {
        // Figma Button/Solid size=Large 기준 — 페이지 하단 CTA(제출/확정 등)에 size="large"로 적용
        padding: '12px 28px',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.0912px',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8, // Toss 인풋 반경 — shape.borderRadius와 동일하게 명시해 하드코딩 드리프트 방지
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12, // Toss Standard 카드
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 12, // Toss Badge 반경
      },
    },
  },
  // Toss 스위치 스타일 — https://tossmini-docs.toss.im/tds-mobile/components/switch/
  // 리플 없는 플랫한 pill 토글: off=grey[300], on=blue[500], 흰색 원형 thumb
  MuiSwitch: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        width: 52,
        height: 32,
        padding: 0,
        overflow: 'visible',
        '& .MuiSwitch-switchBase': {
          padding: 4,
          transitionDuration: '200ms',
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#FFFFFF',
            '& + .MuiSwitch-track': {
              backgroundColor: primitives.blue[500],
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-disabled': {
            '& .MuiSwitch-thumb': {
              color: primitives.grey[50],
            },
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: primitives.grey[100],
            },
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 24,
          height: 24,
          boxShadow: '0px 2px 4px rgba(25, 31, 40, 0.15)',
        },
        '& .MuiSwitch-track': {
          borderRadius: 16,
          backgroundColor: primitives.grey[300],
          opacity: 1,
          transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '&.MuiSwitch-sizeSmall': {
          width: 40,
          height: 24,
          '& .MuiSwitch-switchBase': {
            padding: 3,
            '&.Mui-checked': {
              transform: 'translateX(16px)',
            },
          },
          '& .MuiSwitch-thumb': {
            width: 18,
            height: 18,
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
          },
        },
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
  cardBorderRadius: 12,
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
  subBorderRadius: 8,
  dividerColor: primitives.grey[200],
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
