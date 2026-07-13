import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { primitives } from '../../styles/themes';

// Figma 최종본 커스텀 값 — 표준 orange 스케일에 없는 조정 시나리오 대표 카드 배경(=yellow/50과 동일 hex)
const ADJUST_PRIMARY_BG = primitives.yellow[50];

const TIER_STYLE = {
  primary: {
    blue: { bgcolor: 'rgba(232,243,255,0.5)', borderColor: primitives.blue[500], iconColor: primitives.blue[500] },
    orange: { bgcolor: ADJUST_PRIMARY_BG, borderColor: primitives.orange[300], iconColor: primitives.orange[600] },
  },
  secondary: {
    blue: { bgcolor: 'background.paper', borderColor: primitives.blue[100] },
    orange: { bgcolor: 'background.paper', borderColor: primitives.orange[100] },
  },
};

/**
 * RecommendedSlotCard 컴포넌트
 *
 * RecommendedTimeCard 안에서 개별 시간 후보 하나를 보여주는 카드. 3단계 위계로 표시한다:
 * primary(대표/1등, 배경 채움+굵은 accent 보더+풀컬러 체크), secondary(2·3등, 흰 배경+옅은
 * accent 보더), plain(그 외 참고용 옵션, 무채색 기본 보더) — 위계가 낮을수록 체크 아이콘은
 * 40% opacity 회색으로 톤다운된다.
 *
 * 동작 방식:
 * 1. tier='primary'만 배경이 채워지고 보더가 굵어지며(1.5px) 체크 아이콘이 accent 컬러로 표시된다
 * 2. tier='secondary'는 흰 배경에 accent/100의 옅은 보더(1.5px)로 은은하게 톤을 맞춘다
 * 3. tier='plain'은 흰 배경 + 기본 보더(1px)로 완전히 무채색 처리한다
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
  const isPrimary = tier === 'primary';
  const tierStyle = tier === 'plain' ? null : TIER_STYLE[tier][accent];

  return (
    <Box
      sx={{
        bgcolor: tierStyle?.bgcolor ?? 'background.paper',
        border: tier === 'plain' ? '1px solid' : '1.5px solid',
        borderColor: tierStyle?.borderColor ?? 'divider',
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
          <CheckCircleIcon
            sx={{
              fontSize: 20,
              flexShrink: 0,
              color: isPrimary ? tierStyle.iconColor : 'text.disabled',
              opacity: isPrimary ? 1 : 0.4,
            }}
          />
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
