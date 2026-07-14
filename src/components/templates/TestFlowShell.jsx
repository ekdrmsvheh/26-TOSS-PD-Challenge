import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const scenarioOptions = [
  { value: 'A', label: 'A - 해피 패스' },
  { value: 'B', label: 'B - 조정 상황' },
];

// 플로우 항목 — 번호(number)가 같은 항목은 호스트/참석자 관점에서 동시에 진행되는 단계다
const flowGroups = [
  {
    section: '주최자',
    items: [
      { id: 'find-time', role: 'host', step: 1, number: 1, label: '미팅 시간 찾기' },
      { id: 'write-info', role: 'host', step: 2, number: 2, label: '미팅 정보 작성' },
      { id: 'send-review', role: 'host', step: 3, number: 3, label: '일정 검토 요청 발송' },
    ],
  },
  {
    section: '참석자',
    items: [
      { id: 'attendee-response', role: 'participant', step: null, number: 4, label: '일정 확인 후 응답' },
    ],
  },
  {
    section: '주최자',
    items: [
      { id: 'response-status', role: 'host', step: 4, number: 5, label: '응답 현황 확인' },
      { id: 'confirm', role: 'host', step: 5, number: 6, label: '미팅 확정' },
    ],
  },
];

// Process 원형 배지 — default(대기)/selected(현재)/done(완료 체크) 3가지 상태
function ProcessBadge({ state, number }) {
  const isDone = state === 'done';
  const isSelected = state === 'selected';
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDone ? 'primary.dark' : isSelected ? 'grey.400' : 'rgba(36, 42, 48, 0.08)',
      }}
    >
      {isDone ? (
        <CheckIcon sx={{ fontSize: 12, color: '#FFFFFF' }} />
      ) : (
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: isSelected ? '#FFFFFF' : 'grey.500' }}>
          {number}
        </Typography>
      )}
    </Box>
  );
}

// 네비게이션 아이템 — default/hover/pressed 상태는 CSS 의사 클래스로, 선택 여부는 selected prop으로 구분
function NavigationItem({ item, selected, badgeState, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={item.disabled}
      sx={{
        width: '100%',
        justifyContent: 'flex-start',
        gap: '8px',
        p: '12px',
        borderRadius: '12px',
        bgcolor: selected ? 'grey.100' : 'transparent',
        opacity: item.disabled ? 0.4 : 1,
        transition: 'background-color 120ms ease',
        '&:hover': { bgcolor: selected ? 'grey.200' : 'grey.50' },
        '&:active': { bgcolor: selected ? 'grey.300' : 'grey.100' },
      }}
    >
      <ProcessBadge state={badgeState} number={item.number} />
      <Typography
        sx={{
          fontSize: 15,
          // Figma: 선택 SemiBold(600) / 비선택 Medium(500)
          fontWeight: selected ? 600 : 500,
          color: selected ? 'text.primary' : 'grey.700',
        }}
      >
        {item.label}
      </Typography>
    </ButtonBase>
  );
}

/**
 * TestFlowShell 템플릿 (스타일 테스트용 프로토타입 셸)
 *
 * 좌측 고정 사이드바(홈으로 돌아가기, 시나리오 라디오, 플로우 네비게이션) + 우측 가변
 * 메인 콘텐츠 영역으로 구성된 페이지 셸. 과제 제출용 프로토타입에서 플로우 항목을
 * 직접 클릭해 역할(주최자/참여자)과 단계를 오가며 확인할 수 있는 테스트 하네스 전용
 * 레이아웃이다 (실제 서비스 GNB가 아님 — `AppShell`과 별개, Figma node 311:28629 기준).
 *
 * Props:
 * @param {string} role - 현재 역할 ('host' | 'participant') [Optional, 기본값: 'host']
 * @param {number} currentStep - 현재 활성 호스트 단계 (1부터 시작) [Optional, 기본값: 1]
 * @param {number} maxNumber - 진행 가능한 최대 플로우 번호. 이 번호를 초과하는 항목은
 *   메뉴에는 그대로 보이되 클릭이 비활성화된다 (배포 시 미완성 단계 잠금용) [Optional, 기본값: Infinity]
 * @param {function} onSelectItem - 플로우 항목 클릭 핸들러, { role, step }을 전달 [Optional]
 * @param {string} scenario - 현재 선택된 시나리오 ('A' | 'B') [Optional, 기본값: 'A']
 * @param {function} onScenarioChange - 시나리오 라디오 변경 핸들러 [Optional]
 * @param {function} onGoHome - "홈으로 돌아가기" 클릭 핸들러 [Optional]
 * @param {function} onReset - "처음부터 다시 해보기" 클릭 핸들러 [Optional]
 * @param {node} children - 메인 콘텐츠 영역 [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <TestFlowShell
 *   role={role}
 *   currentStep={step}
 *   onSelectItem={({ role, step }) => { setRole(role); if (step) setStep(step); }}
 *   scenario={scenario}
 *   onScenarioChange={setScenario}
 *   onGoHome={() => setPage('intro')}
 *   onReset={() => { setRole('host'); setStep(1); }}
 * >
 *   <AvailableScheduleView hasConditions={scenario === 'B'} />
 * </TestFlowShell>
 */
const TestFlowShell = forwardRef(function TestFlowShell(
  {
    role = 'host',
    currentStep = 1,
    maxNumber = Infinity,
    onSelectItem,
    scenario = 'A',
    onScenarioChange,
    onGoHome,
    onReset,
    children,
    sx,
    ...props
  },
  ref
) {
  // 활성 네비 항목의 뱃지 번호 — step과 number가 어긋날 수 있어 데이터에서 직접 찾는다
  const activeItem = flowGroups
    .flatMap((group) => group.items)
    .find((item) => item.role === role && (role === 'participant' || item.step === currentStep));
  const currentNumber = activeItem?.number ?? currentStep;

  // maxNumber를 넘는 항목(미완성 단계)은 네비에서 숨기고, 남는 항목이 없는 그룹은 통째로 생략한다
  const visibleGroups = flowGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => item.number <= maxNumber) }))
    .filter((group) => group.items.length > 0);

  return (
    <Box ref={ref} sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.stone', ...sx }} {...props}>
      <Box
        component="aside"
        sx={{
          flex: '0 0 300px',
          width: 300,
          height: '100vh',
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          p: '20px',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing="48px">
          <ButtonBase
            onClick={onGoHome}
            sx={{ gap: '8px', justifyContent: 'flex-start', color: 'grey.500', borderRadius: '8px', p: '4px', mx: '-4px' }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.500' }}>홈으로 돌아가기</Typography>
          </ButtonBase>

          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', mb: '12px' }}>
              시나리오
            </Typography>
            <RadioGroup
              row
              value={scenario}
              onChange={(_, value) => onScenarioChange?.(value)}
              sx={{ flexWrap: 'nowrap', bgcolor: '#E9EAF1', borderRadius: '12px', p: '4px', gap: '2px' }}
            >
              {scenarioOptions.map((option) => {
                const isSelected = scenario === option.value;
                return (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        sx={{ position: 'absolute', opacity: 0, width: 0, height: 0, p: 0 }}
                      />
                    }
                    label={option.label}
                    sx={{
                      flex: 1,
                      m: 0,
                      justifyContent: 'center',
                      textAlign: 'center',
                      px: '16px',
                      py: '6px',
                      borderRadius: '8px',
                      bgcolor: isSelected ? 'background.paper' : 'transparent',
                      boxShadow: isSelected ? '0px 4px 4px rgba(36, 42, 48, 0.04)' : 'none',
                      '& .MuiFormControlLabel-label': {
                        fontSize: 15,
                        fontWeight: 600,
                        // 선택 색: A(해피 패스)=primary blue, B(조정 상황)=amber (Figma 298:31317 / 311:27999)
                        color: isSelected
                          ? (option.value === 'A' ? 'primary.main' : '#D58105')
                          : 'grey.500',
                      },
                    }}
                  />
                );
              })}
            </RadioGroup>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', mb: '16px' }}>
              플로우
            </Typography>
            <Stack spacing="8px">
              {visibleGroups.map((group, groupIndex) => (
                <Box key={`${group.section}-${groupIndex}`}>
                  {groupIndex > 0 && (
                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mb: '10px' }} />
                  )}
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.500', mb: '12px' }}>
                    {group.section}
                  </Typography>
                  <Stack>
                    {group.items.map((item) => {
                      const selected = item.role === role && item.number === currentNumber;
                      const badgeState = selected ? 'selected' : item.number < currentNumber ? 'done' : 'default';
                      return (
                        <NavigationItem
                          key={item.id}
                          item={item}
                          selected={selected}
                          badgeState={badgeState}
                          onClick={() => onSelectItem?.({ role: item.role, step: item.step })}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<RestartAltIcon sx={{ fontSize: 18 }} />}
          onClick={onReset}
          sx={{
            // Figma Button/Outlined (311:28546): Medium(500) 16px, radius 12, neutral 16% 보더
            fontSize: 16,
            fontWeight: 500,
            color: 'text.primary',
            borderColor: 'rgba(112, 115, 124, 0.16)',
            borderRadius: '12px',
            py: '12px',
          }}
        >
          처음부터 다시 해보기
        </Button>
      </Box>

      <Box component="main" sx={{ flex: '1 1 0%', minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
});

export { TestFlowShell };
