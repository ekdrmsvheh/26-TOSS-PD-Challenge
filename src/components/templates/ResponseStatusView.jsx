import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { CardContainer } from '../card/CardContainer';
import { CardPageLayout } from '../layout/CardPageLayout';
import { StatusDot } from '../../common/ui/StatusDot';
import { primitives } from '../../styles/themes';

/**
 * ResponseStatusView 템플릿
 *
 * "응답 현황" 화면 — 검토 요청 발송 다음 단계로, 주최자가 참석자별 응답 여부와
 * 후보(날짜)별 투표 결과를 확인하고 다음 행동(리마인드 등)을 판단하는 화면
 * (docs/product/UX flow/UX flow.md 2.8절, 제품 데이터 정책.md 5.3절 참석자 응답 상태 기준).
 *
 * 동작 방식:
 * 1. 좌측 요약 카드는 전체 응답률, 응답 기한, 미응답자, 필수 참석자 확인 필요 여부를 보여준다
 *    (필수 참석자의 미응답·조정 필요는 확정 전 확인 대상으로 별도 표시 — UX flow 2.8절 정책)
 * 2. 우측 "참석자별 응답" 카드는 사람마다 후보 3개 각각의 응답 상태를 칩으로 보여준다
 * 3. 우측 "날짜별 투표 결과" 카드는 후보(날짜)마다 응답 상태 분포와 필수 참석자 가능 수를 집계해 보여주고,
 *    카드를 클릭해 최종 확정할 후보 하나를 고를 수 있다 (라디오 선택, 자동 확정 없음)
 * 4. `비선호지만 가능`은 확정을 막지 않지만 대가로 표시하고, `조정 필요`는 확정 동의로 세지 않는다
 * 5. 후보를 고른 뒤 "미팅 확정하기"를 눌러야 확정된다 — 추천 순서는 판단을 돕는 설명일 뿐 자동 확정하지 않는다
 *    (제품 데이터 정책.md 2.9절). 고른 후보에 필수 참석자 미응답·조정 필요가 남아 있으면 경고 문구를 보여주되 막지는 않는다
 *
 * Props:
 * @param {object} meeting - 미팅 정보 { title, deadline } [Optional, 기본값: 데모 데이터]
 * @param {Array} candidates - 검토 요청한 후보 목록 [{ id, short, date, time }] [Optional, 기본값: 데모 데이터]
 * @param {Array} attendees - 응답 대상 참석자 목록 [{ name, role, tone }] [Optional, 기본값: 데모 데이터]
 * @param {object} responses - 참석자별·후보별 응답 상태 { [name]: { [candidateId]: status } } [Optional, 기본값: 데모 데이터]
 * @param {function} onRemind - "미응답자에게 리마인드 보내기" 클릭 핸들러 [Optional]
 * @param {function} onConfirm - "미팅 확정하기" 클릭 핸들러, 선택한 후보 객체 { id, date, time }를 전달 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ResponseStatusView onRemind={() => sendReminder()} onConfirm={(candidate) => { setConfirmed(candidate); setStep(5); }} />
 */

// 참여 인원 아바타 색상 규칙 — MeetingInfoView와 동일 (docs/product/정책/제품 데이터 정책.md 5.4절)
const requiredAvatarTones = [primitives.blue[500], primitives.blue[400], primitives.blue[300]];
const optionalAvatarTones = [primitives.grey[500], primitives.grey[400]];

const DEFAULT_MEETING = {
  title: 'AI 운영 에이전트 방향 결정',
  deadline: '7월 10일 (금) 오후 1시',
};

const DEFAULT_CANDIDATES = [
  { id: 'c1', short: '7/13', date: '7/13(월)', time: '오전 10:00' },
  { id: 'c2', short: '7/14', date: '7/14(화)', time: '오후 12:00' },
  { id: 'c3', short: '7/15', date: '7/15(수)', time: '오후 5:00' },
];

const DEFAULT_ATTENDEES = [
  { name: '임정희', role: 'required', tone: requiredAvatarTones[0] },
  { name: '이상륜', role: 'required', tone: requiredAvatarTones[1] },
  { name: '허지은', role: 'required', tone: requiredAvatarTones[2] },
  { name: '신창철', role: 'optional', tone: optionalAvatarTones[0] },
  { name: '김주연', role: 'optional', tone: optionalAvatarTones[1] },
];

const DEFAULT_RESPONSES = {
  임정희: { c1: 'available', c2: 'available', c3: 'reluctant' },
  이상륜: { c1: 'pending', c2: 'pending', c3: 'pending' },
  허지은: { c1: 'available', c2: 'adjust', c3: 'unavailable' },
  신창철: { c1: 'unavailable', c2: 'available', c3: 'available' },
  김주연: { c1: 'pending', c2: 'pending', c3: 'pending' },
};

// 참석자 응답 상태 기준 — 제품 데이터 정책.md 5.3절
const STATUS_META = {
  available: { label: '가능', tone: 'success' },
  reluctant: { label: '비선호지만 가능', tone: 'warning' },
  adjust: { label: '조정 필요', tone: 'info' },
  unavailable: { label: '불가', tone: 'error' },
  pending: { label: '미응답', tone: null },
};

// 비선호지만 가능은 확정을 막지 않는 응답으로 취급한다 (제품 데이터 정책.md 5.3절)
const COUNTS_AS_AVAILABLE = new Set(['available', 'reluctant']);

// 아바타에는 성을 뺀 이름 2글자만 표시한다 (예: '임정희' → '정희')
const shortName = (fullName) => fullName.slice(-2);

const statusChipSx = (status) => {
  const tone = STATUS_META[status]?.tone;
  if (!tone) return { bgcolor: 'grey.100', color: 'text.secondary' };
  return { bgcolor: `${tone}.light`, color: `${tone}.dark` };
};

const roleChipSx = {
  fontSize: 12,
  fontWeight: 700,
  color: 'text.secondary',
  bgcolor: 'background.stone',
  px: '10px',
  py: '4px',
  borderRadius: '8px',
  flexShrink: 0,
};

export function ResponseStatusView({
  meeting = DEFAULT_MEETING,
  candidates = DEFAULT_CANDIDATES,
  attendees = DEFAULT_ATTENDEES,
  responses = DEFAULT_RESPONSES,
  onRemind,
  onConfirm,
  sx,
}) {
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const requiredAttendees = attendees.filter((a) => a.role === 'required');

  const hasAnswered = (name, candidateId) => {
    const status = responses[name]?.[candidateId];
    return Boolean(status) && status !== 'pending';
  };

  const isFullyAnswered = (name) => candidates.every((c) => hasAnswered(name, c.id));

  const needsAttention = (attendee) =>
    attendee.role === 'required' &&
    candidates.some((c) => {
      const status = responses[attendee.name]?.[c.id] ?? 'pending';
      return status === 'pending' || status === 'adjust';
    });

  const respondedCount = attendees.filter((a) => isFullyAnswered(a.name)).length;
  const pendingAttendees = attendees.filter((a) => !isFullyAnswered(a.name));
  const flaggedAttendees = attendees.filter(needsAttention);

  const candidateTally = candidates.map((candidate) => {
    const counts = { available: 0, reluctant: 0, adjust: 0, unavailable: 0, pending: 0 };
    let requiredOk = 0;
    attendees.forEach((attendee) => {
      const status = responses[attendee.name]?.[candidate.id] ?? 'pending';
      counts[status] += 1;
      if (attendee.role === 'required' && COUNTS_AS_AVAILABLE.has(status)) requiredOk += 1;
    });
    return { candidate, counts, requiredOk };
  });

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) ?? null;

  const selectedNeedsAttentionNames = selectedCandidate
    ? requiredAttendees
        .filter((attendee) => {
          const status = responses[attendee.name]?.[selectedCandidate.id] ?? 'pending';
          return status === 'pending' || status === 'adjust';
        })
        .map((attendee) => attendee.name)
    : [];

  const handleConfirm = () => {
    if (!selectedCandidate) return;
    onConfirm?.(selectedCandidate);
  };

  const summaryCard = (
    <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: { xs: '100%', md: '360px' }, minWidth: 0 }}>
      <Typography variant="h5" sx={{ mb: '20px' }}>응답 현황 요약</Typography>

      <Typography sx={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
        {respondedCount}<Box component="span" sx={{ fontSize: 15, fontWeight: 600, color: 'text.secondary' }}>/{attendees.length}명</Box>
      </Typography>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '20px' }}>응답 완료</Typography>

      <Box sx={{ borderTop: '1px solid', borderColor: primitives.line.neutral, pt: '16px', mb: '16px' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: '4px' }}>응답 기한</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{meeting.deadline}까지</Typography>
      </Box>

      {pendingAttendees.length > 0 && (
        <Box sx={{ borderTop: '1px solid', borderColor: primitives.line.neutral, pt: '16px', mb: '16px' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: '10px' }}>
            미응답 {pendingAttendees.length}명
          </Typography>
          <Stack spacing="6px">
            {pendingAttendees.map((attendee) => (
              <Stack key={attendee.name} direction="row" alignItems="center" spacing="8px">
                <Avatar sx={{ width: 24, height: 24, fontSize: 10, fontWeight: 600, bgcolor: attendee.tone }}>
                  {shortName(attendee.name)}
                </Avatar>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{attendee.name}</Typography>
                <Box component="span" sx={{ ...roleChipSx, px: '8px', py: '2px', fontSize: 11 }}>
                  {attendee.role === 'required' ? '필수' : '선택'}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      {flaggedAttendees.length > 0 && (
        <Stack direction="row" spacing="10px" sx={{ p: '14px', borderRadius: '12px', bgcolor: 'info.light', mb: '16px' }}>
          <InfoOutlinedIcon sx={{ fontSize: 18, color: 'info.dark', flexShrink: 0, mt: '1px' }} />
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'info.dark', mb: '2px' }}>
              아직 확정할 수 없어요
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'info.dark', lineHeight: 1.6 }}>
              필수 참석자 {flaggedAttendees.map((a) => a.name).join(', ')}님의 미응답·조정 필요는 확정 전 확인 대상이에요.
            </Typography>
          </Box>
        </Stack>
      )}

      <Button
        fullWidth
        variant="outlined"
        disabled={pendingAttendees.length === 0}
        onClick={onRemind}
        sx={{ fontWeight: 700 }}
      >
        미응답자에게 리마인드 보내기
      </Button>
    </CardContainer>
  );

  const attendeeStatusCard = (
    <CardContainer key="attendee-status" variant="elevation" padding="card" radius="card">
      <Typography variant="h5" sx={{ mb: '20px' }}>참석자별 응답</Typography>
      <Stack spacing="14px">
        {attendees.map((attendee) => (
          <Stack
            key={attendee.name}
            direction="row"
            alignItems="center"
            spacing="12px"
            flexWrap="wrap"
            useFlexGap
          >
            <Avatar sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, bgcolor: attendee.tone, flexShrink: 0 }}>
              {shortName(attendee.name)}
            </Avatar>
            <Stack sx={{ minWidth: '84px', flexShrink: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{attendee.name}</Typography>
              <Stack direction="row" spacing="4px" alignItems="center">
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                  {attendee.role === 'required' ? '필수' : '선택'}
                </Typography>
                {needsAttention(attendee) && (
                  <Box component="span" sx={{ fontSize: 10.5, fontWeight: 700, color: 'warning.dark', bgcolor: 'warning.light', px: '6px', py: '1px', borderRadius: '6px' }}>
                    확인 필요
                  </Box>
                )}
              </Stack>
            </Stack>
            <Stack direction="row" spacing="6px" flexWrap="wrap" useFlexGap sx={{ flex: '1 1 0%' }}>
              {candidates.map((candidate) => {
                const status = responses[attendee.name]?.[candidate.id] ?? 'pending';
                return (
                  <Box
                    key={candidate.id}
                    component="span"
                    sx={{ fontSize: 11.5, fontWeight: 700, px: '9px', py: '5px', borderRadius: '8px', ...statusChipSx(status) }}
                  >
                    {candidate.short} · {STATUS_META[status].label}
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </CardContainer>
  );

  const candidateVoteCard = (
    <CardContainer key="candidate-vote" variant="elevation" padding="card" radius="card">
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: '4px' }}>
        <Typography variant="h5">날짜별 투표 결과</Typography>
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>확정할 후보를 선택해 주세요</Typography>
      </Stack>
      <Stack spacing="12px" sx={{ mt: '16px' }}>
        {candidateTally.map(({ candidate, counts, requiredOk }) => {
          const isSelected = selectedCandidateId === candidate.id;
          return (
            <CardContainer
              key={candidate.id}
              variant={isSelected ? 'outlined' : 'filled'}
              padding="md"
              isSelected={isSelected}
              isInteractive
              onClick={() => setSelectedCandidateId(candidate.id)}
              sx={{ borderRadius: '12px', position: 'relative', cursor: 'pointer' }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '10px', pr: '28px' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                  {candidate.date} {candidate.time}
                </Typography>
                <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>
                  필수 {requiredOk}/{requiredAttendees.length} 가능
                </Box>
              </Stack>
              <Stack direction="row" spacing="14px" flexWrap="wrap" useFlexGap>
                {Object.entries(counts)
                  .filter(([, count]) => count > 0)
                  .map(([status, count]) => (
                    <StatusDot
                      key={status}
                      label={STATUS_META[status].label}
                      count={count}
                      color={STATUS_META[status].tone ? `${STATUS_META[status].tone}.main` : 'text.disabled'}
                    />
                  ))}
              </Stack>
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckIcon sx={{ fontSize: 13 }} />
                </Box>
              )}
            </CardContainer>
          );
        })}
      </Stack>
    </CardContainer>
  );

  const confirmRow = (
    <Stack key="confirm" direction="row" justifyContent="space-between" alignItems="center" spacing="16px">
      <Box>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          {selectedCandidate
            ? `${selectedCandidate.date} ${selectedCandidate.time}로 미팅을 확정할게요.`
            : '위 후보 중 확정할 날짜를 하나 선택해 주세요.'}
        </Typography>
        {selectedNeedsAttentionNames.length > 0 && (
          <Typography sx={{ fontSize: 12.5, color: 'warning.dark', fontWeight: 600, mt: '2px' }}>
            필수 참석자 {selectedNeedsAttentionNames.join(', ')}님의 미응답·조정 필요가 아직 남아 있어요.
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={!selectedCandidateId}
        onClick={handleConfirm}
        sx={{ flexShrink: 0 }}
      >
        미팅 확정하기
      </Button>
    </Stack>
  );

  return (
    <CardPageLayout
      title="응답 현황"
      sx={sx}
      left={summaryCard}
      right={[attendeeStatusCard, candidateVoteCard, confirmRow]}
    />
  );
}
