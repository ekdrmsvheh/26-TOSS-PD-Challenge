import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import { CardContainer } from '../card/CardContainer';
import { CardPageLayout } from '../layout/CardPageLayout';
import { primitives } from '../../styles/themes';

/**
 * MeetingConfirmedView 템플릿
 *
 * "미팅 확정" 화면(플로우 5단계) — 응답 현황에서 주최자가 후보 하나를 골라 "미팅 확정하기"를
 * 누른 뒤 보여주는 최종 확정 안내 화면. 확정 시각과 함께 회의 목적, 참석자별 최종 상태를
 * 다시 보여준다 (docs/product/UX flow/UX flow.md 2.9절: 최종 확정 안내에는 회의 목적, 시간,
 * 역할, 준비 자료를 포함한다 · 선택 참석자의 불참은 숨기지 않고 대가로 계속 표시한다).
 *
 * 동작 방식:
 * 1. 상단은 발송 완료 화면(ReviewRequestSentView)과 같은 체크 아이콘 언어로 "확정됐다"는 상태를 알린다
 * 2. "확정된 일정" 카드는 확정 후보의 날짜·시간을 가장 크게 보여주고 회의 목적을 함께 표시한다
 * 3. "참석자" 카드는 확정 후보 하나에 대한 참석자별 최종 응답 상태를 칩으로 보여준다
 *    (비선호·불가는 숨기지 않고 그대로 노출 — 정보를 가리지 않는다는 정책 원칙)
 * 4. "참석자에게 확정 공유하기"는 데모 버튼으로, 실제 발송 로직은 없다
 *
 * Props:
 * @param {object} meeting - 미팅 정보 { title, purpose } [Optional, 기본값: 데모 데이터]
 * @param {object} confirmedCandidate - 확정된 후보 { id, date, time } [Optional, 기본값: 데모 데이터 첫 번째 후보]
 * @param {Array} attendees - 참석자 목록 [{ name, role, tone }] [Optional, 기본값: 데모 데이터]
 * @param {object} responses - 참석자별·후보별 응답 상태 { [name]: { [candidateId]: status } } [Optional, 기본값: 데모 데이터]
 * @param {function} onShare - "참석자에게 확정 공유하기" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <MeetingConfirmedView confirmedCandidate={{ id: 'c1', date: '7/13(월)', time: '오전 10:00' }} />
 */

// 참여 인원 아바타 색상 규칙 — ResponseStatusView와 동일 (docs/product/정책/제품 데이터 정책.md 5.4절)
const requiredAvatarTones = [primitives.blue[500], primitives.blue[400], primitives.blue[300]];
const optionalAvatarTones = [primitives.grey[500], primitives.grey[400]];

const DEFAULT_MEETING = {
  title: 'AI 운영 에이전트 방향 결정',
  purpose: '1차 구현 범위를 정하고 다음 개발 단계를 시작하기 위해',
};

const DEFAULT_CANDIDATE = { id: 'c1', date: '7/13(월)', time: '오전 10:00' };

const DEFAULT_ATTENDEES = [
  { name: '임정희', role: 'required', tone: requiredAvatarTones[0] },
  { name: '이상륜', role: 'required', tone: requiredAvatarTones[1] },
  { name: '허지은', role: 'required', tone: requiredAvatarTones[2] },
  { name: '신창철', role: 'optional', tone: optionalAvatarTones[0] },
  { name: '김주연', role: 'optional', tone: optionalAvatarTones[1] },
];

const DEFAULT_RESPONSES = {
  임정희: { c1: 'available' },
  이상륜: { c1: 'pending' },
  허지은: { c1: 'available' },
  신창철: { c1: 'unavailable' },
  김주연: { c1: 'pending' },
};

// 참석자 응답 상태 기준 — 제품 데이터 정책.md 5.3절 (ResponseStatusView와 동일)
const STATUS_META = {
  available: { label: '가능', tone: 'success' },
  reluctant: { label: '비선호지만 가능', tone: 'warning' },
  adjust: { label: '조정 필요', tone: 'info' },
  unavailable: { label: '불가', tone: 'error' },
  pending: { label: '미응답', tone: null },
};

// 아바타에는 성을 뺀 이름 2글자만 표시한다 (예: '임정희' → '정희')
const shortName = (fullName) => fullName.slice(-2);

const statusChipSx = (status) => {
  const tone = STATUS_META[status]?.tone;
  if (!tone) return { bgcolor: 'grey.100', color: 'text.secondary' };
  return { bgcolor: `${tone}.light`, color: `${tone}.dark` };
};

export function MeetingConfirmedView({
  meeting = DEFAULT_MEETING,
  confirmedCandidate = DEFAULT_CANDIDATE,
  attendees = DEFAULT_ATTENDEES,
  responses = DEFAULT_RESPONSES,
  onShare,
  sx,
}) {
  return (
    <CardPageLayout sx={sx}>
      <Box sx={{ maxWidth: 640, mx: 'auto' }}>
        <Stack alignItems="center" spacing="14px" sx={{ mb: '28px', textAlign: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'success.main',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h4">미팅이 확정됐어요</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            참석자에게 확정 소식을 공유해 주세요.
          </Typography>
        </Stack>

        <CardContainer padding="lg" sx={{ borderRadius: '12px', mb: '16px' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary', mb: '8px' }}>
            확정된 일정
          </Typography>
          <Typography variant="h2" sx={{ mb: '10px' }}>
            {confirmedCandidate.date} {confirmedCandidate.time}
          </Typography>
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: '14px' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, mb: '4px' }}>{meeting.title}</Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.6 }}>{meeting.purpose}</Typography>
          </Box>
        </CardContainer>

        <CardContainer padding="lg" sx={{ borderRadius: '12px', mb: '28px' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '14px' }}>참석자</Typography>
          <Stack spacing="12px">
            {attendees.map((attendee) => {
              const status = responses[attendee.name]?.[confirmedCandidate.id] ?? 'pending';
              return (
                <Stack key={attendee.name} direction="row" alignItems="center" spacing="12px">
                  <Avatar sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, bgcolor: attendee.tone, flexShrink: 0 }}>
                    {shortName(attendee.name)}
                  </Avatar>
                  <Stack sx={{ flex: '1 1 0%', minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{attendee.name}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                      {attendee.role === 'required' ? '필수' : '선택'}
                    </Typography>
                  </Stack>
                  <Box
                    component="span"
                    sx={{ fontSize: 12, fontWeight: 700, px: '10px', py: '5px', borderRadius: '8px', flexShrink: 0, ...statusChipSx(status) }}
                  >
                    {STATUS_META[status].label}
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </CardContainer>

        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onShare}
          >
            참석자에게 확정 공유하기
          </Button>
        </Stack>
      </Box>
    </CardPageLayout>
  );
}
