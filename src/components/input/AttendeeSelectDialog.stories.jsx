import { useState } from 'react';
import Button from '@mui/material/Button';
import { AttendeeSelectDialog } from './AttendeeSelectDialog';
import { testImages } from '../../utils/pexels-test-data';

// 아바타 이미지 컴포넌트 자체를 테스트하는 스토리이므로 실제 이미지(portrait 테스트 데이터)를 사용한다
const portraitThumb = (index) => testImages.portrait[index].src.thumbnail;

const host = { name: '이지혜', role: '제품팀 · 프로덕트 디자이너', avatarSrc: portraitThumb(0) };

const directory = [
  { id: 'p1', name: '정희', role: '제품팀 · 리드', avatarSrc: portraitThumb(1) },
  { id: 'p2', name: '이상륜', role: '개발팀 · 리드', avatarSrc: portraitThumb(2) },
  { id: 'p3', name: '허지은', role: '제품팀 · 프로덕트 매니저', avatarSrc: portraitThumb(3) },
  { id: 'p4', name: '신창철', role: '개발팀 · 프론트엔드', avatarSrc: portraitThumb(4) },
  { id: 'p5', name: '김주연', role: '개발팀 · 백엔드', avatarSrc: portraitThumb(5) },
];

export default {
  title: 'Component/7. Input & Control/AttendeeSelectDialog',
  component: AttendeeSelectDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## AttendeeSelectDialog

"참석 인원을 선택해 주세요" 모달. 주최자 카드(고정) + 검색 드롭다운(Autocomplete)으로 동료를 찾아 추가하는 참석자 목록(필수/선택 토글, 삭제)으로 구성된다.
새로 추가된 참석자는 "필수"로 시작하며, "선택 완료"를 눌러야 변경 사항이 확정된다. 닫기(원형 X)는 변경을 취소한다.
        `,
      },
    },
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [participants, setParticipants] = useState([]);

    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          참석 인원 편집
        </Button>
        <AttendeeSelectDialog
          open={open}
          onClose={() => setOpen(false)}
          host={host}
          directory={directory}
          participants={participants}
          onConfirm={setParticipants}
        />
      </>
    );
  },
};

export const Prefilled = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [participants, setParticipants] = useState([
      { id: 'p1', name: '정희', role: '제품팀 · 리드', roleLevel: 'required', avatarSrc: portraitThumb(1) },
      { id: 'p4', name: '신창철', role: '개발팀 · 프론트엔드', roleLevel: 'optional', avatarSrc: portraitThumb(4) },
    ]);

    return (
      <AttendeeSelectDialog
        open={open}
        onClose={() => setOpen(false)}
        host={host}
        directory={directory}
        participants={participants}
        onConfirm={setParticipants}
      />
    );
  },
};
