import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { primitives } from '../../styles/themes';

// Figma 최종본 커스텀 값 — 표준 orange 스케일에 없는 조정 시나리오 대표 카드 배경(=yellow/50과 동일 hex)
const ADJUST_PRIMARY_BG = primitives.yellow[50];

// 카드 프레임(배경/보더) — tier×accent
const FRAME_STYLE = {
  primary: {
    blue: { bgcolor: 'rgba(232,243,255,0.5)', borderColor: primitives.blue[500] },
    orange: { bgcolor: ADJUST_PRIMARY_BG, borderColor: primitives.orange[300] },
  },
  secondary: {
    blue: { bgcolor: 'background.paper', borderColor: primitives.blue[100] },
    orange: { bgcolor: 'background.paper', borderColor: primitives.orange[100] },
  },
};

// 체크 아이콘 색 — Figma 아이콘 에셋 실측값. primary/secondary는 항상 "체크됨"(채워진 원)이고
// 시나리오별로 순위에 따라 톤이 살짝 다르다(조정 시나리오는 대표=orange/800, 2·3등=orange/700)
const ICON_COLOR = {
  primary: { blue: primitives.blue[600], orange: primitives.orange[800] },
  secondary: { blue: primitives.blue[600], orange: primitives.orange[700] },
};
const PLAIN_ICON_COLOR = primitives.grey[400]; // "체크 안됨" — 테두리만 있는 원, 항상 이 회색

/**
 * RecommendedSlotCard 컴포넌트
 *
 * RecommendedTimeCard 안에서 개별 시간 후보 하나를 보여주는 카드. 3단계 위계로 표시한다:
 * primary(대표/1등, 배경 채움+굵은 accent 보더), secondary(2·3등, 흰 배경+옅은 accent 보더) —
 * 이 둘은 모두 "체크됨" 상태로 채워진 체크 아이콘을 보여준다. plain(그 외 참고용 옵션)만
 * "체크 안됨" 상태로 테두리만 있는 회색 아이콘을 보여준다.
 *
 * 동작 방식:
 * 1. tier='primary'는 배경이 채워지고 보더가 굵어지며(1.5px) 체크 아이콘이 accent 컬러로 채워진다
 * 2. tier='secondary'는 흰 배경에 accent/100의 옅은 보더(1.5px)이지만 체크 아이콘은 primary와
 *    동일하게 채워진 상태(색만 한 톤 옅음)로 표시된다
 * 3. tier='plain'은 흰 배경 + 기본 보더(1px) + 테두리만 있는 회색 체크 아이콘(미선택 상태)이다
 * 4. 캡션은 항상 grey 톤 고정색이며, 날짜 텍스트 시작 위치에 맞춰 28px 들여쓰기된다
 *
 * Props:
 * @param {string} dateTime - 날짜·시간 텍스트 (예: '7/13(월) 오전 10:00') [Required]
 * @param {string} caption - 하단 설명 텍스트 (예: '전원 참석', '정희님 조정 시 전원 참여') [Optional]
 * @param {'primary'|'secondary'|'plain'} tier - 카드 위계 [Optional, 기본값: 'plain']
 * @param {'blue'|'orange'} accent - primary/secondary일 때 강조 색상 (전원가능=blue, 조정필요=orange) [Optional, 기본값: 'blue']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <RecommendedSlotCard dateTime="7/13(월) 오전 10:00" caption="전원 참석, 가장 빠른 시간" tier="primary" accent="blue" />
 */
export function RecommendedSlotCard({ dateTime, caption, tier = 'plain', accent = 'blue', sx }) {
  const isChecked = tier === 'primary' || tier === 'secondary';
  const frame = isChecked ? FRAME_STYLE[tier][accent] : null;
  const iconColor = isChecked ? ICON_COLOR[tier][accent] : PLAIN_ICON_COLOR;

  return (
    <Box
      sx={{
        bgcolor: frame?.bgcolor ?? 'background.paper',
        border: isChecked ? '1.5px solid' : '1px solid',
        borderColor: frame?.borderColor ?? 'divider',
        borderRadius: '12px',
        px: '14px',
        py: '12px',
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      <Stack spacing="2px" sx={{ width: '100%' }}>
        <Stack direction="row" alignItems="center" spacing="8px" sx={{ width: '100%' }}>
          {isChecked ? (
            <CheckCircleIcon sx={{ fontSize: 20, flexShrink: 0, color: iconColor }} />
          ) : (
            <CheckCircleOutlineIcon sx={{ fontSize: 20, flexShrink: 0, color: iconColor }} />
          )}
          <Typography sx={{ flex: 1, minWidth: 0, fontSize: 17, fontWeight: 600, color: 'text.primary' }} noWrap>
            {dateTime}
          </Typography>
        </Stack>
        {caption && (
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey.500', pl: '28px' }} noWrap>
            {caption}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
