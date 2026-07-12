import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { CardContainer } from '../card/CardContainer';

/**
 * AvailableScheduleView 템플릿 (스타일 테스트용 프로토타입)
 *
 * "미팅 일정" 화면 — 미팅 조건(참여 인원/시간 조건)을 입력하고 가능한 일정을
 * 추천 카드 + 주간 캘린더로 보여준다. 아직 디자인이 확정 전이라 공식 디자인
 * 토큰(primitives/palette)에 편입하지 않고, 이 파일 안에서만 색상을 하드코딩한
 * 테스트 버전이다. 디자인이 정리되면 component-work 워크플로우로 재작업한다.
 *
 * 동작 방식:
 * 1. hasConditions가 false면 우측에 빈 상태(안내 문구)만 보여준다
 * 2. hasConditions가 true면 추천 일정 카드 + 주간 캘린더 + "다음" 버튼을 보여준다
 * 3. 캘린더의 바쁜 시간/추천 시간은 mockEvents로 하드코딩된 데모 데이터다 (실제 일정 연동 없음)
 *
 * Props:
 * @param {boolean} hasConditions - 조건 입력 완료 여부 [Optional, 기본값: false]
 * @param {function} onShowSchedule - "가능한 일정 보기" 클릭 핸들러 [Optional]
 * @param {function} onNext - "다음" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AvailableScheduleView hasConditions={hasConditions} onShowSchedule={() => setHasConditions(true)} />
 */

// 테스트 전용 색상 팔레트 (디자인 확정 전 — 확정되면 primitives로 이관)
const testColors = {
  pageBg: '#F5F6FA',
  ctaBg: '#DCE6FB',
  ctaText: '#3E63D6',
  nextBg: '#4C6FEF',
  tagPurpleBg: '#EDE9FE',
  tagPurpleText: '#6D5BD0',
  tagBlueBg: '#E3EBFC',
  tagBlueText: '#3E63D6',
  requiredAvatars: ['#2E3A6E', '#4C6FE8', '#5B93EF', '#86C2F5'],
  optionalAvatar: '#C7CDD6',
  eventIndigo: '#6C5CE7',
  eventBlue1: '#4FA3E8',
  eventBlue2: '#2E7CE0',
  slotHighlight: '#EAF1FE',
};

const requiredAttendees = ['지혜', '정희', '상륜', '지은'];
const optionalAttendees = ['창철', '주연'];

const recommendations = [
  { date: '14일(월)', time: '오전 10:00', tags: [{ label: '모든 인원 가능', tone: 'purple' }, { label: '가장 빠른 시간', tone: 'purple' }] },
  { date: '15일 (수)', time: '오후 4:00', tags: [{ label: '필수 인원 가능', tone: 'blue' }, { label: '선택 1인 불가', tone: 'blue' }] },
  { date: '13일 (월)', time: '오후 2:00', tags: [{ label: '필수 인원 가능', tone: 'blue' }, { label: '선택 1인 불가', tone: 'blue' }] },
];

const days = [
  { label: '월', date: 13 },
  { label: '화', date: 14 },
  { label: '수', date: 15 },
  { label: '목', date: 16 },
  { label: '금', date: 17 },
];

const hours = ['오전 9:00', '오전 10:00', '오전 11:00', '오후 12:00', '오후 1:00', '오후 2:00', '오후 3:00', '오후 4:00', '오후 5:00'];

// { dayIndex, hourIndex } 기준 데모 이벤트/추천 슬롯 (원본 스크린샷 배치 재현)
const mockEvents = { '1-1': testColors.eventIndigo, '0-5': testColors.eventBlue1, '2-7': testColors.eventBlue2 };
const mockHighlights = ['3-1', '3-3', '4-6'];

export function AvailableScheduleView({ hasConditions = false, onShowSchedule, onNext, sx }) {
  return (
    <Box sx={{ bgcolor: testColors.pageBg, p: { xs: 2, md: 4 }, minHeight: '100vh', ...sx }}>
      <Typography sx={{ fontSize: 28, fontWeight: 700, mb: '32px' }}>미팅 일정</Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '24px', alignItems: 'flex-start' }}>
        {/* 미팅 조건 */}
        <CardContainer padding="lg" sx={{ borderRadius: '20px', flex: { xs: '1 1 0%', md: '0 0 400px' }, width: { xs: '100%', md: '400px' }, minWidth: 0 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: '20px' }}>미팅 조건</Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '14px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>참여 인원</Typography>
            {hasConditions && (
              <Typography sx={{ fontSize: 13, color: testColors.ctaText, textDecoration: 'underline', cursor: 'pointer' }}>
                편집
              </Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" spacing="10px" sx={{ mb: hasConditions ? '14px' : '20px' }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', width: '32px', flexShrink: 0 }}>필수</Typography>
            <Stack direction="row" sx={{ '& > *': { ml: '-8px' }, '& > *:first-of-type': { ml: 0 } }}>
              {(hasConditions ? requiredAttendees : requiredAttendees.slice(0, 1)).map((name, i) => (
                <Avatar
                  key={name}
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: 13,
                    fontWeight: 600,
                    border: '2px solid #FFFFFF',
                    bgcolor: testColors.requiredAvatars[i % testColors.requiredAvatars.length],
                  }}
                >
                  {name[0]}
                </Avatar>
              ))}
              <IconButton
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  border: '1.5px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <AddIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </IconButton>
            </Stack>
          </Stack>

          {hasConditions && (
            <Stack direction="row" alignItems="center" spacing="10px" sx={{ mb: '20px' }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', width: '32px', flexShrink: 0 }}>선택</Typography>
              <Stack direction="row" sx={{ '& > *': { ml: '-8px' }, '& > *:first-of-type': { ml: 0 } }}>
                {optionalAttendees.map((name) => (
                  <Avatar
                    key={name}
                    sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 600, border: '2px solid #FFFFFF', bgcolor: testColors.optionalAvatar }}
                  >
                    {name[0]}
                  </Avatar>
                ))}
              </Stack>
            </Stack>
          )}

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: '20px', mb: '20px' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, mb: '16px' }}>시간 조건</Typography>

            <Stack spacing="14px">
              <Box>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '6px' }}>미팅 길이</Typography>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '10px', px: '14px', py: '11px', fontSize: 14, fontWeight: 600 }}>
                  1시간
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '6px' }}>조회 기간</Typography>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '10px', px: '14px', py: '11px', fontSize: 14, fontWeight: 600 }}>
                  {hasConditions ? '7월 13일 (월) ~ 7월 17일 (금)' : '전체'}
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '6px' }}>조회 시간</Typography>
                <Stack direction="row" alignItems="center" spacing="8px">
                  <Box sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: '10px', px: '14px', py: '11px', fontSize: 14, fontWeight: 600 }}>
                    오전 9:00
                  </Box>
                  <Typography sx={{ color: 'text.disabled' }}>~</Typography>
                  <Box sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: '10px', px: '14px', py: '11px', fontSize: 14, fontWeight: 600 }}>
                    오후 5:00
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Button
            fullWidth
            onClick={onShowSchedule}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: testColors.ctaBg,
              color: testColors.ctaText,
              fontWeight: 700,
              py: '13px',
              borderRadius: '14px',
              '&:hover': { bgcolor: testColors.ctaBg, opacity: 0.85 },
            }}
          >
            가능한 일정 보기
          </Button>
        </CardContainer>

        {/* 가능한 일정 */}
        <Box sx={{ flex: '1 1 0%', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CardContainer
            padding="lg"
            sx={{ borderRadius: '20px', minHeight: hasConditions ? 'auto' : '420px', display: 'flex', flexDirection: 'column' }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: hasConditions ? '18px' : 0 }}>가능한 일정</Typography>

            {!hasConditions && (
              <Stack alignItems="center" justifyContent="center" spacing="12px" sx={{ flex: 1 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
                <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', lineHeight: 1.6 }}>
                  참여 인원과 시간 조건을 설정하면
                  <br />
                  가능한 일정이 표시돼요
                </Typography>
              </Stack>
            )}

            {hasConditions && (
              <>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '12px' }}>추천 일정</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {recommendations.map((rec) => (
                    <Box key={rec.date + rec.time} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '14px', p: '16px' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: '10px' }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                          {rec.date} {rec.time}
                        </Typography>
                        <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      </Stack>
                      <Stack direction="row" spacing="6px" sx={{ flexWrap: 'wrap' }}>
                        {rec.tags.map((tag) => (
                          <Box
                            key={tag.label}
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              px: '8px',
                              py: '4px',
                              borderRadius: '6px',
                              bgcolor: tag.tone === 'purple' ? testColors.tagPurpleBg : testColors.tagBlueBg,
                              color: tag.tone === 'purple' ? testColors.tagPurpleText : testColors.tagBlueText,
                            }}
                          >
                            {tag.label}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </CardContainer>

          {hasConditions && (
            <CardContainer padding="lg" sx={{ borderRadius: '20px' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '18px' }}>
                <Typography sx={{ fontSize: 18, fontWeight: 700 }}>캘린더</Typography>
                <Stack direction="row" alignItems="center" spacing="6px">
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>상세 일정</Typography>
                  <Switch size="small" />
                </Stack>
              </Stack>

              <Box sx={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', minWidth: 0 }}>
                <Box />
                {days.map((day) => (
                  <Stack key={day.date} alignItems="center" sx={{ pb: '10px' }}>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{day.label}</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{day.date}</Typography>
                  </Stack>
                ))}

                {hours.map((hour, hourIndex) => (
                  <Fragment key={hour}>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', pr: '10px', pt: '6px' }}>
                      {hour}
                    </Typography>
                    {days.map((day, dayIndex) => {
                      const key = `${dayIndex}-${hourIndex}`;
                      const eventColor = mockEvents[key];
                      const isHighlight = mockHighlights.includes(key);
                      return (
                        <Box
                          key={key}
                          sx={{
                            height: '44px',
                            m: '2px',
                            borderRadius: '8px',
                            bgcolor: eventColor || (isHighlight ? testColors.slotHighlight : 'transparent'),
                            backgroundImage: eventColor || isHighlight
                              ? 'none'
                              : 'repeating-linear-gradient(-45deg, #ECEEF2 0, #ECEEF2 1px, transparent 1px, transparent 8px)',
                            backgroundColor: eventColor || (isHighlight ? testColors.slotHighlight : '#FAFAFB'),
                          }}
                        />
                      );
                    })}
                  </Fragment>
                ))}
              </Box>
            </CardContainer>
          )}

          {hasConditions && (
            <Stack direction="row" justifyContent="flex-end">
              <Button
                onClick={onNext}
                sx={{ bgcolor: testColors.nextBg, color: '#FFFFFF', fontWeight: 700, px: '28px', py: '11px', borderRadius: '12px', '&:hover': { bgcolor: testColors.nextBg, opacity: 0.9 } }}
              >
                다음
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
