import { Fragment, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { primitives } from '../../styles/themes';

// Figma 최종본 커스텀 값 — 표준 스케일에 없는 정확한 지정색(출처: 캘린더 스펙 프레임)
const TIME_LABEL_COLOR = '#A8AAAC'; // 시간축 라벨(오전 9:00 등) 전용 회색
const EVENT_TEXT_COLOR = '#8AA6BB'; // 상세보기 일정 텍스트 기본색(Figma "avata/optional" 변수값)
const CONFLICT_ACCENT_COLOR = '#C37500'; // 조정 원인이 되는 일정의 마커·텍스트 강조색

const LEGEND = {
  recommend: [
    { label: '빈시간', swatchBg: '#FFFFFF', swatchBorder: primitives.grey[300] },
    { label: '가능', swatchBg: primitives.blue[100], swatchBorder: primitives.blue[200] },
    { label: '불가', swatchBg: primitives.grey[300], swatchBorder: 'rgba(0,0,0,0.03)' },
  ],
  adjust: [
    { label: '조정 가능한 일정', swatchBg: primitives.orange[100], swatchBorder: 'rgba(0,0,0,0.03)' },
    { label: '불가', swatchBg: primitives.grey[300], swatchBorder: 'rgba(0,0,0,0.03)' },
  ],
};

// 셀 상태별 배경/보더 — scenario(recommend=blue, adjust=orange)에 따라 강조 색만 바뀐다.
// highlight-primary/secondary 모두 텍스트 라벨은 없고 색으로만 표현한다(최종 확정본 기준).
const cellStyle = (state, scenario) => {
  const accent = scenario === 'adjust' ? primitives.orange : primitives.blue;
  const primaryBg = scenario === 'adjust' ? 'rgba(255,243,224,0.5)' : 'rgba(232,243,255,0.5)'; // accent/50 @ 50% opacity
  if (state === 'highlight-primary') return { bgcolor: primaryBg, border: `1.5px solid ${accent[300]}` };
  if (state === 'highlight') return { bgcolor: 'transparent', border: `1.5px solid ${accent[100]}` };
  if (state === 'empty') return { bgcolor: '#FFFFFF', border: `1.5px solid ${primitives.grey[200]}` };
  return { bgcolor: primitives.grey[50], border: `1.5px solid ${primitives.grey[100]}` }; // unavailable(기본)
};

/**
 * CalendarAvailabilityCard 컴포넌트
 *
 * "캘린더" 카드 — 요일×시간 그리드에 참석자들의 가능/불가 상태를 색으로 보여준다.
 * scenario에 따라 강조색(전원 참석 가능=blue, 조정 필요=orange)과 범례 구성이 달라지고,
 * "상세 일정 보기" 토글을 켜면 각 셀에 참석자별 일정이 불릿 리스트로 펼쳐지며, 조정의
 * 원인이 되는 일정에는 속이 빈 점 마커 + 강조색으로 표시된다.
 *
 * 동작 방식:
 * 1. cellStates: `${dayIndex}-${hourIndex}` 키로 'unavailable'(기본, 불가) | 'empty'(빈시간, blue
 *    시나리오 전용) | 'highlight'(가능/조정가능, 보조 — 투명 배경+옅은 보더) |
 *    'highlight-primary'(대표 — 반투명 배경+굵은 보더) 지정. 어떤 상태든 텍스트 라벨은 없다
 * 2. "상세 일정 보기"가 꺼져 있으면 색 블록만 노출
 * 3. 켜면 events의 참석자별 일정이 셀 안에 펼쳐지고, isConflict인 일정은 속이 빈 점 마커 +
 *    강조색(#C37500)으로 표시되어 "이 일정 때문에 조정이 필요하다"는 걸 짚어준다
 *
 * Props:
 * @param {'recommend'|'adjust'} scenario - 전원 참석 가능(blue)/조정 필요(orange) 시나리오 [Optional, 기본값: 'recommend']
 * @param {{label: string, date: number}[]} days - 요일 컬럼 목록 [Required]
 * @param {string[]} hours - 시간 행 목록 [Required]
 * @param {object} cellStates - `${dayIndex}-${hourIndex}` → 셀 상태 맵 [Optional]
 * @param {object} events - `${dayIndex}-${hourIndex}` → [{ person, title, isConflict }] 상세보기용 일정 맵 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <CalendarAvailabilityCard
 *   scenario="recommend"
 *   days={days}
 *   hours={hours}
 *   cellStates={{ '0-1': 'highlight-primary', '1-3': 'highlight' }}
 *   events={{ '0-0': [{ person: '정희', title: '주간회의', isConflict: false }] }}
 * />
 */
export function CalendarAvailabilityCard({ scenario = 'recommend', days, hours, cellStates = {}, events = {}, sx }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', ...sx }}>
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary', flexShrink: 0 }}>캘린더</Typography>
        <Stack direction="row" alignItems="center" spacing="12px" sx={{ flex: 1, minWidth: 0, pl: '16px' }} justifyContent="flex-end">
          <Stack direction="row" alignItems="center" spacing="8px">
            {LEGEND[scenario].map((item) => (
              <Stack key={item.label} direction="row" alignItems="center" spacing="4px">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '3px',
                    bgcolor: item.swatchBg,
                    border: '1px solid',
                    borderColor: item.swatchBorder,
                  }}
                />
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'grey.500' }}>{item.label}</Typography>
              </Stack>
            ))}
          </Stack>
          <Box sx={{ width: '1px', height: '13px', bgcolor: primitives.line.neutral, flexShrink: 0 }} />
          <Stack direction="row" alignItems="center" spacing="8px">
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'grey.500' }}>상세 일정 보기</Typography>
            <Switch size="small" checked={showDetail} onChange={(e) => setShowDetail(e.target.checked)} />
          </Stack>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: '60px repeat(5, minmax(0, 1fr))', gap: '5px' }}>
        <Box />
        {days.map((day) => (
          <Stack key={day.date} direction="row" alignItems="baseline" justifyContent="center" spacing="6px" sx={{ py: '6px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.700' }}>{day.date}</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'grey.500' }}>{day.label}</Typography>
          </Stack>
        ))}

        {hours.map((hour, hourIndex) => (
          <Fragment key={hour}>
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: '10px' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: TIME_LABEL_COLOR, textAlign: 'center' }}>
                {hour}
              </Typography>
            </Box>
            {days.map((day, dayIndex) => {
              const key = `${dayIndex}-${hourIndex}`;
              const state = cellStates[key] ?? 'unavailable';
              const cellEvents = events[key] ?? [];
              return (
                <Box
                  key={key}
                  sx={{
                    ...cellStyle(state, scenario),
                    borderRadius: '6px',
                    minHeight: '44px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: showDetail ? '8px 10px' : 0,
                    gap: '3px',
                  }}
                >
                  {showDetail &&
                    cellEvents.map((ev, i) => (
                      <Stack key={i} direction="row" alignItems="center" spacing="3px">
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            flexShrink: 0,
                            ...(ev.isConflict
                              ? { border: `1px solid ${CONFLICT_ACCENT_COLOR}`, bgcolor: 'transparent' }
                              : { bgcolor: EVENT_TEXT_COLOR }),
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            lineHeight: 1.273,
                            letterSpacing: '0.11px',
                            color: ev.isConflict ? CONFLICT_ACCENT_COLOR : EVENT_TEXT_COLOR,
                          }}
                          noWrap
                        >
                          {ev.person}: {ev.title}
                        </Typography>
                      </Stack>
                    ))}
                </Box>
              );
            })}
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
