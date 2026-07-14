import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import { alpha } from '@mui/material/styles';
import { CardContainer } from '../card/CardContainer';
import { CardPageLayout } from '../layout/CardPageLayout';
import { primitives } from '../../styles/themes';
import { testImages } from '../../utils/pexels-test-data';

/**
 * MeetingConfirmedView 템플릿
 *
 * "미팅 확정" 화면(플로우 6단계) — 응답 현황에서 주최자가 후보 하나를 골라 "미팅 확정하기"를
 * 누른 뒤 보여주는 최종 확정 안내 화면. 확정된 시간 범위와 함께 회의 목적, 참석자별 최종 참석
 * 여부를 다시 보여준다 (docs/product/UX flow/UX flow.md 2.9절: 최종 확정 안내에는 회의 목적, 시간,
 * 역할, 준비 자료를 포함한다 · 선택 참석자의 불참은 숨기지 않고 대가로 계속 표시한다).
 * Figma 실측값(node-id 344:50380) 기준으로 구현했다 — 확정 화면은 응답 상태(가능/비선호지만
 * 가능/조정 필요/불가)를 그대로 보여주지 않고 참석/불참 2가지로 단순화해 보여준다(불가만 불참).
 *
 * 동작 방식:
 * 1. 상단은 발송 완료 화면(ReviewRequestSentView)과 같은 체크 아이콘 언어로 "확정됐다"는 상태를 알린다
 * 2. "확정 일정" 카드는 확정 후보의 시작~종료 시간 범위를 가장 크게 보여주고 회의 목적을 함께 표시한다
 * 3. "참석자" 카드는 확정 후보 하나에 대한 참석자별 참석/불참 배지를 보여준다
 *    (불가만 불참으로 표시 — 정보를 가리지 않는다는 정책 원칙)
 * 4. "완료"는 데모 버튼으로, 클릭하면 플로우를 마치고 처음 화면으로 돌아가는 용도로 쓴다
 *
 * Props:
 * @param {object} meeting - 미팅 정보 { title, purpose } [Optional, 기본값: 데모 데이터]
 * @param {object} confirmedCandidate - 확정된 후보 { id, date, time } [Optional, 기본값: 데모 데이터 첫 번째 후보]
 * @param {number} durationMinutes - 미팅 길이(분), 시간 범위 표시에 사용 [Optional, 기본값: 60]
 * @param {Array} attendees - 참석자 목록 [{ name, team, avatarIndex }] [Optional, 기본값: 데모 데이터]
 * @param {object} responses - 참석자별·후보별 응답 상태 { [name]: { [candidateId]: status } } [Optional, 기본값: 데모 데이터]
 * @param {function} onComplete - "완료" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <MeetingConfirmedView confirmedCandidate={{ id: 'c1', date: '7/13(월)', time: '오전 10:00' }} onComplete={onGoHome} />
 */

// 데모용 프로필 사진 — Pexels 테스트 데이터(portrait 카테고리) 재사용, AvailableScheduleView와 동일 규칙
const portraitThumb = (index) => testImages.portrait[index % testImages.portrait.length].src.thumbnail;

const DEFAULT_MEETING = {
  title: 'AI 운영 에이전트 방향 결정',
  purpose: '1차 구현 범위를 정하고 다음 개발 단계를 시작하기 위해',
};

const DEFAULT_CANDIDATE = { id: 'c1', date: '7/13(월)', time: '오전 10:00' };

// 이름·팀·아바타는 AvailableScheduleView의 HOST/DIRECTORY와 동일 인물(같은 avatarIndex) 사용
const DEFAULT_ATTENDEES = [
  { name: '이지혜', team: '제품팀 · 프로덕트 디자이너', avatarIndex: 0 },
  { name: '임정희', team: '제품팀 · 리드', avatarIndex: 1 },
  { name: '이상륜', team: '개발팀 · 리드', avatarIndex: 2 },
  { name: '허지은', team: '제품팀 · 프로덕트 매니저', avatarIndex: 3 },
  { name: '신창철', team: '개발팀 · 프론트엔드', avatarIndex: 4 },
  { name: '김주연', team: '개발팀 · 백엔드', avatarIndex: 5 },
];

const DEFAULT_RESPONSES = {
  이지혜: { c1: 'available' },
  임정희: { c1: 'available' },
  이상륜: { c1: 'available' },
  허지은: { c1: 'available' },
  신창철: { c1: 'unavailable' },
  김주연: { c1: 'available' },
};

const MERIDIEM_TIME_PATTERN = /^(오전|오후)\s*(\d{1,2}):(\d{2})$/;

function parseKoreanTime(timeStr) {
  const match = timeStr.match(MERIDIEM_TIME_PATTERN);
  if (!match) return null;
  const [, meridiem, hourStr, minuteStr] = match;
  const hour12 = Number(hourStr) % 12;
  return { hour24: meridiem === '오후' ? hour12 + 12 : hour12, minute: Number(minuteStr) };
}

function formatKoreanHour(hour24, minute, { withMeridiem = true } = {}) {
  const meridiem = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const hourLabel = minute === 0 ? `${hour12}시` : `${hour12}시 ${minute}분`;
  return withMeridiem ? `${meridiem} ${hourLabel}` : hourLabel;
}

// 확정 카드 제목 — "7/13(월) 오전 10시 ~ 11시"처럼 시작~종료 시간 범위로 보여준다 (Figma node-id 344:51436)
function formatConfirmedTimeRange(date, startTime, durationMinutes) {
  const start = parseKoreanTime(startTime);
  if (!start) return `${date} ${startTime}`;
  const endTotalMinutes = start.hour24 * 60 + start.minute + durationMinutes;
  const endHour24 = Math.floor(endTotalMinutes / 60) % 24;
  const endMinute = endTotalMinutes % 60;
  const sameMeridiem = (start.hour24 < 12) === (endHour24 < 12);
  const startLabel = formatKoreanHour(start.hour24, start.minute);
  const endLabel = formatKoreanHour(endHour24, endMinute, { withMeridiem: !sameMeridiem });
  return `${date} ${startLabel} ~ ${endLabel}`;
}

// Figma "Content Badge" 스펙 — 8% 투명도 틴트 배경 + 동일 색 SemiBold 텍스트 (AttendeeReviewView와 동일 규칙)
const attendanceBadgeSx = (isAttending) => {
  const tone = isAttending ? primitives.blue[600] : primitives.grey[700];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    height: '20px',
    px: '6px',
    borderRadius: '6px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.11px',
    color: tone,
    bgcolor: alpha(tone, 0.08),
    flexShrink: 0,
  };
};

export function MeetingConfirmedView({
  meeting = DEFAULT_MEETING,
  confirmedCandidate = DEFAULT_CANDIDATE,
  durationMinutes = 60,
  attendees = DEFAULT_ATTENDEES,
  responses = DEFAULT_RESPONSES,
  onComplete,
  sx,
}) {
  return (
    <CardPageLayout sx={sx}>
      <Box sx={{ maxWidth: 560, mx: 'auto', mt: '80px' }}>
        <Stack alignItems="center" spacing="40px">
          <Stack alignItems="center" spacing="32px" sx={{ width: '100%' }}>
            <Stack alignItems="center" spacing="20px">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckIcon sx={{ fontSize: 24 }} />
              </Box>
              <Stack alignItems="center" spacing="12px" sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 28, fontWeight: 700, lineHeight: 1.358, letterSpacing: '-0.66px', color: 'text.primary' }}>
                  미팅이 확정됐어요
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 400, lineHeight: 1.429, letterSpacing: '0.203px', color: 'grey.700' }}>
                  참석자에게 확정 일정을 안내하고, 미팅 전 리마인드도 보내드릴게요
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing="12px" sx={{ width: '100%' }}>
              <CardContainer variant="elevation" padding="lg" radius="card">
                <Stack spacing="12px">
                  <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.24px', color: 'text.primary' }}>
                    {formatConfirmedTimeRange(confirmedCandidate.date, confirmedCandidate.time, durationMinutes)}
                  </Typography>
                  <Box sx={{ height: '1px', width: '100%', bgcolor: primitives.line.neutral }} />
                  <Stack spacing="8px">
                    <Typography sx={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.091px', color: 'grey.700' }}>
                      {meeting.title}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 400, lineHeight: 1.429, letterSpacing: '0.203px', color: 'grey.500' }}>
                      {meeting.purpose}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContainer>

              <CardContainer
                variant="outlined"
                padding="card"
                radius="card"
                sx={{ borderColor: 'rgba(0, 0, 0, 0.07)', boxShadow: '0px 2px 2.5px rgba(0, 0, 0, 0.03)' }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.429, letterSpacing: '0.203px', color: 'grey.700', mb: '8px' }}>
                  참석자
                </Typography>
                <Stack>
                  {attendees.map((attendee) => {
                    const status = responses[attendee.name]?.[confirmedCandidate.id] ?? 'unavailable';
                    const isAttending = status !== 'unavailable';
                    return (
                      <Fragment key={attendee.name}>
                        <Box sx={{ height: '1px', width: '100%', bgcolor: primitives.line.neutral }} />
                        <Stack direction="row" alignItems="center" spacing="8px" sx={{ pl: '8px', pr: '12px', py: '8px', borderRadius: '8px' }}>
                          <Avatar
                            src={portraitThumb(attendee.avatarIndex)}
                            sx={{ width: 26, height: 26, border: '1.5px solid #FFFFFF', flexShrink: 0 }}
                          />
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flex: '1 1 0%', minWidth: 0 }}>
                            <Stack direction="row" alignItems="center" spacing="8px" sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.144px', color: 'text.primary', whiteSpace: 'nowrap' }}>
                                {attendee.name}
                              </Typography>
                              <Typography sx={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.12px', color: 'grey.400', whiteSpace: 'nowrap' }}>
                                {attendee.team}
                              </Typography>
                            </Stack>
                            <Box component="span" sx={attendanceBadgeSx(isAttending)}>
                              {isAttending ? '참석' : '불참'}
                            </Box>
                          </Stack>
                        </Stack>
                      </Fragment>
                    );
                  })}
                </Stack>
              </CardContainer>
            </Stack>
          </Stack>

          <Box sx={{ width: '360px', maxWidth: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={onComplete}
            >
              완료
            </Button>
          </Box>
        </Stack>
      </Box>
    </CardPageLayout>
  );
}
