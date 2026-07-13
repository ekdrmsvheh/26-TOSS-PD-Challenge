import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CardContainer } from '../card/CardContainer';
import { CardPageLayout } from '../layout/CardPageLayout';

/**
 * AttendeeReviewView 템플릿
 *
 * "참석자 일정 검토" 화면 — 주최자가 보낸 검토 요청을 받은 참석자가 자신이 왜 필요한지
 * 확인하고, 후보 3개 각각에 대해 캘린더에 없는 숨은 조건(비선호·조정 필요·불가)만
 * 응답하는 화면. 후보는 확정된 일정이 아니라는 점을 반복해 알려준다
 * (docs/product/PROJECT_CONTEXT.md 설계 원칙 6: 미응답·확인 중·조정 필요는 가능으로 간주하지 않는다).
 *
 * 동작 방식:
 * 1. 후보 3개 카드마다 가능/비선호지만 가능/조정 필요/불가 중 하나를 골라야 한다
 * 2. 3개 후보 모두 응답해야 "응답 제출하기" 버튼이 활성화된다
 * 3. 제출하면 카드 목록 대신 제출 완료 상태(체크 아이콘 + 안내 문구)를 보여준다
 *
 * Props:
 * @param {object} meeting - 미팅 정보 { title, purpose, deadline } [Optional, 기본값: 데모 데이터]
 * @param {object} me - 응답하는 참석자 정보 { name, reason } [Optional, 기본값: 데모 데이터]
 * @param {Array} candidates - 검토할 후보 목록 [Optional, 기본값: 데모 데이터]
 * @param {function} onSubmit - 응답 제출 핸들러, { candidateId: responseValue } 전달 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AttendeeReviewView onSubmit={(responses) => console.log(responses)} />
 */

const DEFAULT_MEETING = {
  title: 'AI 운영 에이전트 방향 결정',
  purpose: '1차 구현 범위를 정하고 다음 개발 단계를 시작하기 위해',
  deadline: '7월 10일 (금) 오후 1시',
};

const DEFAULT_ME = {
  name: '임정희',
  reason: '이번 스프린트 범위와 우선순위를 확정해야 해서 정희님의 판단이 필요해요',
};

const DEFAULT_CANDIDATES = [
  {
    id: 'c1',
    date: '7/13(월)',
    time: '오전 10:00',
    badge: '추천',
    badgeTone: 'primary',
    meta: ['필수 3/3', '선택 2/2'],
    note: '모두 참석 가능한 가장 빠른 시간이에요',
  },
  {
    id: 'c2',
    date: '7/14(화)',
    time: '오후 12:00',
    badge: '모두 가능',
    badgeTone: 'success',
    meta: ['필수 3/3', '선택 2/2'],
    note: '조정 비용 없이 전원 참석 가능해요',
  },
  {
    id: 'c3',
    date: '7/15(수)',
    time: '오후 5:00',
    badge: '빠른 대안',
    badgeTone: 'default',
    meta: ['필수 3/3', '선택 1/2'],
    note: '선택 참석자 1명은 참석이 어려워요',
  },
];

const RESPONSE_OPTIONS = [
  { value: 'available', label: '가능', tone: 'success' },
  { value: 'reluctant', label: '비선호지만 가능', tone: 'warning' },
  { value: 'adjust', label: '조정 필요', tone: 'info' },
  { value: 'unavailable', label: '불가', tone: 'error' },
];

const badgeSx = (tone) => {
  if (tone === 'default') {
    return { bgcolor: 'grey.200', color: 'text.secondary' };
  }
  return { bgcolor: `${tone}.light`, color: `${tone}.dark` };
};

const responseOptionSx = (tone, isSelected) => ({
  flex: '1 1 auto',
  minWidth: '96px',
  border: '1px solid',
  borderColor: isSelected ? `${tone}.main` : 'divider',
  borderRadius: '10px',
  px: '10px',
  py: '9px',
  fontSize: 12.5,
  fontWeight: 700,
  fontFamily: 'inherit',
  textAlign: 'center',
  cursor: 'pointer',
  bgcolor: isSelected ? `${tone}.light` : 'background.paper',
  color: isSelected ? `${tone}.dark` : 'text.secondary',
  transition: 'all 0.15s ease',
  '&:hover': { borderColor: `${tone}.main` },
});

export function AttendeeReviewView({
  meeting = DEFAULT_MEETING,
  me = DEFAULT_ME,
  candidates = DEFAULT_CANDIDATES,
  onSubmit,
  sx,
}) {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = candidates.every((candidate) => responses[candidate.id]);

  const handleSelect = (candidateId, value) => {
    setResponses((prev) => ({ ...prev, [candidateId]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(responses);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <CardPageLayout sx={{ ...sx, alignItems: 'center' }}>
        <Stack alignItems="center" spacing="20px" sx={{ maxWidth: 420, mx: 'auto', textAlign: 'center' }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'success.main', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h4">응답을 제출했어요</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
            {meeting.title} 검토 요청에 응답했어요. 주최자가 전체 응답 현황을 확인한 뒤 최종 일정을 확정하면 다시 알려드릴게요.
          </Typography>
        </Stack>
      </CardPageLayout>
    );
  }

  return (
    <CardPageLayout sx={sx}>
      <Box sx={{ maxWidth: 640, mx: 'auto' }}>
        <Box
          component="span"
          sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main', bgcolor: 'primary.light', px: '10px', py: '4px', borderRadius: '8px' }}
        >
          참석자 화면
        </Box>
        <Typography variant="h2" sx={{ mt: '14px', mb: '8px' }}>{meeting.title}</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: '24px' }}>{meeting.purpose}</Typography>

        <CardContainer padding="lg" sx={{ borderRadius: '12px', mb: '16px' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary', mb: '8px' }}>
            {me.name} 님이 필요한 이유
          </Typography>
          <Typography sx={{ fontSize: 14, lineHeight: 1.6 }}>{me.reason}</Typography>
        </CardContainer>

        <CardContainer padding="lg" sx={{ borderRadius: '12px', mb: '20px' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: '8px' }}>검토할 후보 3개</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.6 }}>
            아직 확정된 일정이 아니에요. 각 후보에 대해 캘린더에 없는 불가·비선호 또는 조정 필요 여부만 답해 주세요.
          </Typography>
        </CardContainer>

        <Stack spacing="14px">
          {candidates.map((candidate) => (
            <CardContainer key={candidate.id} padding="lg" sx={{ borderRadius: '12px' }}>
              <Stack direction="row" alignItems="center" spacing="8px" sx={{ mb: '4px' }}>
                <Box component="span" sx={{ fontSize: 12, fontWeight: 700, px: '8px', py: '3px', borderRadius: '6px', ...badgeSx(candidate.badgeTone) }}>
                  {candidate.badge}
                </Box>
                <Stack direction="row" spacing="6px">
                  {candidate.meta.map((item) => (
                    <Typography key={item} sx={{ fontSize: 12, color: 'text.secondary' }}>{item}</Typography>
                  ))}
                </Stack>
              </Stack>
              <Typography sx={{ fontSize: 16, fontWeight: 700, mb: '2px' }}>
                {candidate.date} {candidate.time}
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '14px' }}>{candidate.note}</Typography>

              <Stack direction="row" flexWrap="wrap" useFlexGap spacing="8px">
                {RESPONSE_OPTIONS.map((option) => (
                  <Box
                    key={option.value}
                    component="button"
                    type="button"
                    onClick={() => handleSelect(candidate.id, option.value)}
                    sx={responseOptionSx(option.tone, responses[candidate.id] === option.value)}
                  >
                    {option.label}
                  </Box>
                ))}
              </Stack>
            </CardContainer>
          ))}
        </Stack>

        <Stack direction="row" spacing="10px" sx={{ mt: '20px', mb: '28px', p: '14px', borderRadius: '12px', bgcolor: 'info.light' }}>
          <InfoOutlinedIcon sx={{ fontSize: 18, color: 'info.dark', flexShrink: 0, mt: '1px' }} />
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'info.dark', mb: '2px' }}>조정 필요는 확정 동의가 아니에요</Typography>
            <Typography sx={{ fontSize: 12.5, color: 'info.dark', lineHeight: 1.6 }}>
              기존 일정을 옮길 수 있는지 주최자가 다시 확인한 뒤 반영해요.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing="16px">
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            응답 기한 {meeting.deadline}까지 3개 후보 모두 응답해 주세요.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!canSubmit}
            onClick={handleSubmit}
            sx={{ flexShrink: 0 }}
          >
            응답 제출하기
          </Button>
        </Stack>
      </Box>
    </CardPageLayout>
  );
}
