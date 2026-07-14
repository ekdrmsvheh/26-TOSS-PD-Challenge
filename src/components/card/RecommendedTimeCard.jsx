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
const MAX_SELECTABLE = 5;

/**
 * RecommendedTimeCard 컴포넌트
 *
 * "추천 시간" 카드 — 참석자에게 확인 요청할 "후보 시간 묶음"을 고르는 체크박스형 선택 UI다
 * (최종 시간 1개를 확정하는 UI가 아니다). 시간 조건에 맞는 후보를 3열 그리드로 보여주고,
 * 각 카드를 클릭해 선택/해제할 수 있다. 선택된 후보 중 목록상 가장 앞선(가장 빠른) 것이
 * primary(배경 채움+굵은 accent 보더)로, 나머지 선택된 후보는 secondary(옅은 accent 보더)로
 * 강조되며 — 이 둘은 모두 체크 아이콘이 채워진다. 선택 해제된 후보는 plain(무채색+빈 원)이다.
 * "모든 후보 보기" 토글을 켜면 4~5번째 후보까지 펼쳐서 선택할 수 있다.
 *
 * 동작 방식:
 * 1. 기본값은 접힘 상태 — 슬롯 3개까지만 노출(모두 기본 선택된 상태로 전달받는다)
 * 2. "모든 후보 보기" 토글을 켜면 slots 전체(최대 5개, 2행)를 노출
 * 3. 카드 클릭 시 onToggleSlot(dateTime)을 호출한다 — 최소 1개 유지·최대 5개 제한 같은 실제
 *    선택 로직은 상위(AvailableScheduleView)에서 selectedKeys를 갱신하는 방식으로 처리한다
 * 4. selectedKeys에 없는 슬롯은 plain, 있으면 selectedKeys 순서상 가장 먼저 선택된 슬롯만 primary,
 *    나머지는 secondary로 표시된다
 *
 * Props:
 * @param {'recommend'|'adjust'} scenario - 전원 참석 가능(blue)/조정 필요(orange) 시나리오 [Optional, 기본값: 'recommend']
 * @param {{dateTime: string, caption: string}[]} slots - 시간 후보 목록(최대 5개) [Required]
 * @param {Set<string>} selectedKeys - 선택된 슬롯의 dateTime 집합 [Optional, 기본값: 빈 Set]
 * @param {function} onToggleSlot - 카드 클릭 시 호출 (dateTime) => void [Optional]
 * @param {string} description - 안내 문구 [Optional, scenario 기본 문구 사용]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <RecommendedTimeCard scenario="recommend" slots={slots} selectedKeys={selectedKeys} onToggleSlot={handleToggleSlot} />
 */
export function RecommendedTimeCard({ scenario = 'recommend', slots = [], selectedKeys, onToggleSlot, description, sx }) {
  const [showAll, setShowAll] = useState(false);
  const accent = scenario === 'adjust' ? 'orange' : 'blue';
  const visibleSlots = showAll ? slots : slots.slice(0, COLLAPSED_COUNT);
  const keys = selectedKeys ?? new Set();
  const firstSelectedDateTime = slots.find((slot) => keys.has(slot.dateTime))?.dateTime;
  const isAtMax = keys.size >= MAX_SELECTABLE;

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
        {visibleSlots.map((slot) => {
          const isSelected = keys.has(slot.dateTime);
          const tier = !isSelected ? 'plain' : slot.dateTime === firstSelectedDateTime ? 'primary' : 'secondary';
          return (
            <RecommendedSlotCard
              key={slot.dateTime}
              dateTime={slot.dateTime}
              caption={slot.caption}
              tier={tier}
              accent={accent}
              onClick={() => onToggleSlot?.(slot.dateTime)}
            />
          );
        })}
      </Box>

      {isAtMax && (
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'grey.500' }}>
          후보는 최대 {MAX_SELECTABLE}개까지 선택할 수 있어요
        </Typography>
      )}
    </Box>
  );
}
