# Project Rules

## 언어

- 항상 한국어로 응답한다. 코드 주석, 커밋 메시지도 별도 요청이 없으면 한국어로 작성한다.
- Bash 등 도구 실행 전 설명, permission 프롬프트에 뜨는 명령어 설명 문구도 한국어로 작성한다.

## Product Context

- 프로덕트(밋핏) 배경/정책/UX 기준 → `docs/product/PROJECT_CONTEXT.md`부터 읽는다 (나머지 확정본 파일 위치를 안내함)
- 참고용 풀플로우 프로토타입(원본 구현) → `src/externalComponents/참고 프로토타입/`

## Workflow

- 기획 문서 작성 → `/project-planning` Skill이 워크플로우 담당
- 컴포넌트 작업 → `/component-work` Skill이 워크플로우 담당
- 리팩토링 → `refactoring-guide.md` 참조, 기존 스토리 통과 확인
- 룰 수정 시 → `pnpm generate-rules` 실행하여 Storybook 시각화 동기화