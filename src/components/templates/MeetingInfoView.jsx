import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import { CardContainer } from '../card/CardContainer';
import { SelectTrigger } from '../input/SelectTrigger';
import { CardPageLayout } from '../layout/CardPageLayout';
import { primitives } from '../../styles/themes';

/**
 * MeetingInfoView 템플릿
 *
 * "미팅 정보 작성" 화면 — 미팅 시간 찾기 다음 단계로, 확정 전 추천 시간 후보를 고르고
 * 미팅 주제/목적/참석 요청 이유/응답 기한을 작성해 참석자에게 보낼 검토 요청을 준비한다.
 *
 * 동작 방식:
 * 1. 좌측 "미팅 조건" 카드는 미팅 시간 찾기 단계의 참여 인원을 그대로 보여주고,
 *    추천 시간 후보 중 하나를 선택해 검토 요청에 담을 시간을 고른다 (기본: 첫 번째 후보)
 * 2. 우측 "미팅 목적" 카드의 "AI 자동 생성"을 누르면 미팅 주제를 바탕으로 미팅 목적과
 *    참석자별 참석 요청 이유를 데모 문구로 한 번에 채운다 (실제 생성 없는 프로토타입 데모)
 * 3. 미팅 목적이 비어 있으면 "일정 검토 요청 보내기" 버튼이 비활성 상태로 표시된다
 *
 * Props:
 * @param {function} onSubmit - "일정 검토 요청 보내기" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <MeetingInfoView onSubmit={() => setStep(3)} />
 */

// 참여 인원 아바타 색상 규칙 — AvailableScheduleView와 동일 (docs/product/정책/제품 데이터 정책.md 5.4절)
const requiredAvatarTones = [primitives.blue[600], primitives.blue[500], primitives.blue[400], primitives.blue[300]];
const optionalAvatarTones = [primitives.grey[500], primitives.grey[400]];

const HOST = { name: '이지혜', tone: requiredAvatarTones[0] };
const REQUIRED_ATTENDEES = [
  { name: '임정희', tone: requiredAvatarTones[1] },
  { name: '이상륜', tone: requiredAvatarTones[2] },
  { name: '허지은', tone: requiredAvatarTones[3] },
];
const OPTIONAL_ATTENDEES = [
  { name: '신창철', tone: optionalAvatarTones[0] },
  { name: '김주연', tone: optionalAvatarTones[1] },
];

// 아바타에는 성을 뺀 이름 2글자만 표시한다 (예: '임정희' → '정희')
const shortName = (fullName) => fullName.slice(-2);

const timeCandidates = [
  { label: '전원 참여, 가장 빠른 시간', date: '7/13(월)', time: '오전 10:00' },
  { label: '전원 참석', date: '7/14(화)', time: '오후 12:00' },
  { label: '전원 참석', date: '7/15(수)', time: '오후 5:00' },
];

// "AI 자동 생성" 클릭 시 채워지는 데모 문구
const AI_GENERATED_PURPOSE = '1차 구현 범위를 정하고 다음 개발 단계를 시작하기 위해';
const AI_GENERATED_REASONS = {
  임정희: '이번 스프린트 범위와 우선순위를 확정해야 해서 정희님의 판단이 필요해요',
  이상륜: '결정한 방향이 실제 구현 가능한지 바로 확인해야 해요',
  허지은: 'API 영향이 있는 안건이라 기술 검토 의견이 필요해요',
  신창철: '콘텐츠 정책과 표현 기준에 어긋나는 부분이 있는지 확인 부탁드려요',
  김주연: '결정 이후 측정할 지표와 로그 기준을 함께 정리하려고 해요',
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: 14,
    fontWeight: 600,
    bgcolor: 'background.paper',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'text.secondary' },
  },
  '& .MuiOutlinedInput-input::placeholder, & .MuiOutlinedInput-input.Mui-disabled::placeholder': {
    color: 'text.disabled',
    opacity: 1,
  },
};

export function MeetingInfoView({ onSubmit, sx }) {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [topic, setTopic] = useState('AI 운영 에이전트 방향 결정');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [purpose, setPurpose] = useState('');
  const [reasons, setReasons] = useState({});
  const [deadline] = useState('7월 10일 (금) 오후 1시');
  const [autoReminder] = useState('요청 후 1시간 뒤');

  const attendeeReasonRows = [
    ...REQUIRED_ATTENDEES.map((person) => ({ ...person, level: 'required' })),
    ...OPTIONAL_ATTENDEES.map((person) => ({ ...person, level: 'optional' })),
  ];

  const handleGeneratePurpose = () => {
    setPurpose(AI_GENERATED_PURPOSE);
    setReasons(AI_GENERATED_REASONS);
  };

  const handleReasonChange = (name, value) => {
    setReasons((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = purpose.trim().length > 0;

  const leftCard = (
    <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: { xs: '100%', md: '400px' }, minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: '20px' }}>미팅 조건</Typography>

          <Typography sx={{ fontSize: 14, fontWeight: 600, mb: '14px' }}>참여 인원</Typography>
          <Stack direction="row" spacing="6px" flexWrap="wrap" sx={{ mb: '20px' }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, bgcolor: HOST.tone }}>
              {shortName(HOST.name)}
            </Avatar>
            {REQUIRED_ATTENDEES.map((person) => (
              <Avatar key={person.name} sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, bgcolor: person.tone }}>
                {shortName(person.name)}
              </Avatar>
            ))}
            {OPTIONAL_ATTENDEES.map((person) => (
              <Avatar key={person.name} sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, bgcolor: person.tone }}>
                {shortName(person.name)}
              </Avatar>
            ))}
          </Stack>

          <Box sx={{ borderTop: '1px solid', borderColor: primitives.line.neutral, pt: '20px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: '14px' }}>추천 시간</Typography>
            <Stack spacing="10px">
              {timeCandidates.map((candidate, index) => {
                const isSelected = index === selectedTimeIndex;
                return (
                  <CardContainer
                    key={candidate.date + candidate.time}
                    variant="outlined"
                    padding="md"
                    isSelected={isSelected}
                    isInteractive
                    onClick={() => setSelectedTimeIndex(index)}
                    sx={{ borderRadius: '12px', position: 'relative', cursor: 'pointer' }}
                  >
                    <Typography sx={{ fontSize: 12, color: isSelected ? 'primary.main' : 'text.secondary', mb: '4px' }}>
                      {candidate.label}
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                      {candidate.date} {candidate.time}
                    </Typography>
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
            <Stack alignItems="center" sx={{ mt: '8px' }}>
              <IconButton size="small" aria-label="추천 시간 더 보기">
                <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </IconButton>
            </Stack>
          </Box>
  </CardContainer>
  );

  const basicInfoCard = (
    <CardContainer key="basic-info" variant="elevation" padding="card" radius="card">
      <Typography variant="h5" sx={{ mb: '20px' }}>기본 정보</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '20px' }}>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: '7px' }}>
                  미팅 주제
                  <Box component="span" sx={{ color: 'error.main' }}> *</Box>
                </Typography>
                <TextField
                  fullWidth
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="미팅 주제를 입력해 주세요"
                  sx={fieldSx}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: '7px' }}>
                  관련 자료
                </Typography>
                <TextField
                  fullWidth
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="URL을 입력해 주세요"
                  sx={fieldSx}
                />
              </Box>
            </Box>
  </CardContainer>
  );

  const purposeCard = (
    <CardContainer key="purpose" variant="elevation" padding="card" radius="card">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '20px' }}>
              <Typography variant="h5">미팅 목적</Typography>
              <Button
                size="small"
                startIcon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />}
                onClick={handleGeneratePurpose}
                sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}
              >
                AI 자동 생성
              </Button>
            </Stack>

            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: '7px' }}>미팅 목적</Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="회의에서 결정해야 할 내용을 입력해 주세요"
              sx={{ ...fieldSx, mb: '20px' }}
            />

            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: '10px' }}>참석 요청 이유</Typography>
            <Stack spacing="10px">
              {attendeeReasonRows.map((person) => (
                <Stack key={person.name} direction="row" alignItems="center" spacing="12px">
                  <Typography sx={{ fontSize: 14, fontWeight: 600, width: '52px', flexShrink: 0 }}>
                    {person.name}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'text.secondary',
                      bgcolor: 'background.stone',
                      px: '10px',
                      py: '4px',
                      borderRadius: '8px',
                      flexShrink: 0,
                    }}
                  >
                    {person.level === 'required' ? '필수' : '선택'}
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    value={reasons[person.name] ?? ''}
                    onChange={(e) => handleReasonChange(person.name, e.target.value)}
                    placeholder="미팅 참석 필요성을 이해할 수 있게 적어 주세요"
                    sx={fieldSx}
                  />
                </Stack>
              ))}
            </Stack>
  </CardContainer>
  );

  const responseRequestCard = (
    <CardContainer key="response-request" variant="elevation" padding="card" radius="card">
      <Typography variant="h5" sx={{ mb: '20px' }}>응답 요청</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '20px' }}>
        <SelectTrigger label="응답 기한" value={deadline} onClick={() => {}} />
        <SelectTrigger label="미응답 자동 리마인드" value={autoReminder} onClick={() => {}} />
      </Box>
    </CardContainer>
  );

  const submitRow = (
    <Stack key="submit" direction="row" justifyContent="space-between" alignItems="center" spacing="16px">
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        추천 시간과 미팅 정보를 바탕으로, 실제 가능 여부를 확인 요청할게요.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={!canSubmit}
        onClick={onSubmit}
        sx={{ flexShrink: 0 }}
      >
        일정 검토 요청 보내기
      </Button>
    </Stack>
  );

  return (
    <CardPageLayout
      title="미팅 정보"
      sx={sx}
      left={leftCard}
      right={[basicInfoCard, purposeCard, responseRequestCard, submitRow]}
    />
  );
}
