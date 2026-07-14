import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { RecommendedSlotCard } from './RecommendedSlotCard';

const DEFAULT_DESCRIPTION = {
  recommend: '전원이 참석할 수 있는 시간 중 가장 빠른 3개를 추천해요. 필요하면 후보를 변경한 뒤 참석자에게 요청할 수 있어요.',
  adjust: '필수 인원이 모두 가능한 시간이 없어요. 선택 참여 일정 조정이 필요한 후보를 추천했어요.',
};

const COLLAPSED_COUNT = 3;

// 슬롯 위치 기반 위계: 1등=primary, 2~3등(접힘 상태에서 보이는 나머지)=secondary,
// "모든 후보 보기"로 펼쳤을 때 나오는 4등 이후는 전부 plain(무채색)
const tierOf = (index) => {
  if (index === 0) return 'primary';
  if (index < COLLAPSED_COUNT) return 'secondary';
  return 'plain';
};

/**
 * RecommendedTimeCard 컴포넌트
 *
 * "추천 시간" 카드 — 시간 조건에 맞는 후보를 3열 그리드로 보여준다. slots[0]이 대표(1등)
 * 후보로 배경 채움+굵은 accent 보더로 강조되고, 2·3등은 옅은 accent 보더, "모든 후보 보기"로
 * 펼쳤을 때 나오는 4등 이후는 전부 완전 무채색(참고용 옵션)으로 톤다운된다. scenario에 따라
 * 전원 참석 가능(blue)/조정 필요(orange) 톤과 안내 문구가 바뀐다.
 *
 * 동작 방식:
 * 1. 기본값은 접힘 상태 — 슬롯 3개까지만 노출
 * 2. "모든 후보 보기" 토글을 켜면 slots 전체(최대 2행)를 노출
 * 3. slots[0]이 대표 슬롯으로 취급되어 배경+보더로 강조된다 (tierOf 참고)
 *
 * Props:
 * @param {'recommend'|'adjust'} scenario - 전원 참석 가능(blue)/조정 필요(orange) 시나리오 [Optional, 기본값: 'recommend']
 * @param {{dateTime: string, caption: string}[]} slots - 시간 후보 목록. 첫 항목이 대표 슬롯 [Required]
 * @param {string} description - 안내 문구 [Optional, scenario 기본 문구 사용]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <RecommendedTimeCard scenario="recommend" slots={[{ dateTime: '7/13(월) 오전 10:00', caption: '전원 참석' }]} />
 */
export function RecommendedTimeCard({ scenario = 'recommend', slots = [], description, sx }) {
  const [showAll, setShowAll] = useState(false);
  const accent = scenario === 'adjust' ? 'orange' : 'blue';
  const visibleSlots = showAll ? slots : slots.slice(0, COLLAPSED_COUNT);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', ...sx }}>
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Stack direction="row" alignItems="center" spacing="7px" sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>추천 시간</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing="8px">
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.500' }}>모든 후보 보기</Typography>
          <Switch
            size="small"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
        </Stack>
      </Stack>

      <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'grey.500' }}>
        {description ?? DEFAULT_DESCRIPTION[scenario]}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '8px',
        }}
      >
        {visibleSlots.map((slot, i) => (
          <RecommendedSlotCard
            key={slot.dateTime}
            dateTime={slot.dateTime}
            caption={slot.caption}
            tier={tierOf(i)}
            accent={accent}
          />
        ))}
      </Box>
    </Box>
  );
}
