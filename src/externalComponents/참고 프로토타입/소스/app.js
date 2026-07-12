const people = [
  { name: "이지혜", job: "Product Design", role: "필수", calendar: "화·수 오전 가능", why: "최종 UX 방향을 결정해요.", detail: "결정해야 하는 UX 방향과 사용성 기준을 최종 판단해요." },
  { name: "김민준", job: "PM", role: "필수", calendar: "화 오전 기존 회의 조정 필요", why: "1차 구현 범위와 우선순위를 승인해요.", detail: "이번 스프린트에 넣을 범위와 우선순위를 확정해야 해요." },
  { name: "박현수", job: "Frontend", role: "필수", calendar: "화 오전 가능", why: "이번 스프린트 구현 가능성을 판단해요.", detail: "정해진 방향이 실제로 구현 가능한지 바로 확인해야 해요." },
  { name: "이서연", job: "Backend", role: "선택", calendar: "목 오후 기존 회의", why: "API 제약을 미리 검토하면 좋아요.", detail: "API 영향이 있는 안건이 나오면 의견이 필요해요." },
  { name: "정수빈", job: "Content", role: "선택", calendar: "대부분 가능", why: "생성 콘텐츠 정책을 검토해요.", detail: "콘텐츠 정책과 표현 기준에 어긋나는 부분을 확인해요." },
  { name: "최도윤", job: "Data", role: "선택", calendar: "오후 4시 이후 불가", why: "측정 계획에 참고해요.", detail: "결정 이후 측정할 지표와 로그 기준을 정리해요." }
];

const scenarioCandidates = {
  mixed: [
    { date: "7월 15일 수요일", short: "15일(수)", dayKey: "수 15", start: "오후 2:00", time: "오후 2:00-3:00", title: "모두 참석 가능한 가장 빠른 시간", meta: ["필수 3/3", "선택 3/3"], cost: "조정 없음", badge: "추천", tone: "best" },
    { date: "7월 16일 목요일", short: "16일(목)", dayKey: "목 16", start: "오전 11:00", time: "오전 11:00-12:00", title: "모두 참석 가능 · 조정 비용 없음", meta: ["필수 3/3", "선택 3/3"], cost: "하루 늦어짐", badge: "모두 가능", tone: "safe" },
    { date: "7월 14일 화요일", short: "14일(화)", dayKey: "화 14", start: "오전 10:00", time: "오전 10:00-11:00", title: "가장 빠르지만 선택 1명 불가", meta: ["필수 3/3", "선택 2/3"], cost: "선택 1명 불참", badge: "빠른 대안", tone: "alt" }
  ],
  noRequired: [
    { date: "조정 가능", short: "14일(화)", dayKey: "화 14", start: "오전 10:00", time: "오전 10:00-11:00", title: "김민준의 겹친 일정이 다른 회의에서 선택 참석이에요", meta: ["필수 3/3", "조정 요청 1명"], cost: "김민준 일정 조정 요청 필요", badge: "조정안", tone: "adjust" }
  ]
};

const scenarioCopy = {
  mixed: {
    label: "시나리오 2",
    title: "모두 참석 가능한 후보와 빠른 대안이 함께 있어요",
    description: "기본 추천은 모두 참석 가능한 시간을 우선하고, 가장 빠른 시간은 선택 참석자 1명 불참 비용이 있는 대안으로 보여줘요.",
    heading: "검토할 후보 3개",
    cta: "이 후보들로 검토 요청하기"
  },
  noRequired: {
    label: "시나리오 3",
    title: "필수 참석자 전원이 가능한 시간이 없어요",
    description: "현재 조건에서는 확정 후보가 없어서, 필수 참석자의 겹친 일정 중 조정 요청 가능한 케이스만 먼저 보여줘요.",
    heading: "현재 조건 안에서 가능한 조정안",
    cta: "조정안 검토하기"
  }
};

const adjustmentStrategies = [
  {
    title: "김민준 일정 조정 요청",
    label: "현재 조건 유지",
    summary: "김민준 님이 겹친 다른 회의에서 선택 참석자라, 해당 일정의 주최자에게 조정 가능 여부를 확인할 수 있어요.",
    cost: "필수 참석자 1명에게 일정 조정 요청 필요",
    note: "제품은 조정 가능성이 있는 일정만 찾아줍니다. 실제 조정 요청과 최종 결정은 주최자가 확인해야 해요."
  }
];

const stages = [
  ["explore", "일정 탐색"],
  ["details", "요청 정보"],
  ["sent", "검토 요청"],
  ["responses", "응답 현황"],
  ["adjust", "조정안"],
  ["final", "최종 확정"]
];

const app = document.querySelector("#app");
const state = {
  stage: "explore",
  searched: false,
  dirty: false,
  blocked: false,
  scenario: "mixed",
  selected: 0,
  finalSelected: 0,
  adjustmentSelected: 0,
  showCalendarDetail: false,
  range: "week",
  duration: "60",
  rangeCustom: "7월 13일(월) - 7월 17일(금)",
  searchStart: "오전 9:00",
  searchEnd: "오후 5:00",
  lastConditions: null,
  meeting: {
    title: "AI 페이지 생성 방향 결정",
    purpose: "1차 구현 범위를 정하고 다음 개발 단계를 시작하기 위해",
    deadline: "7월 13일 월요일 오전 10시",
    attachment: "AI 페이지 생성 PRD 초안.pdf"
  },
  responseMode: "pending"
};

function roleCounts() {
  return people.reduce((acc, person) => {
    acc[person.role] += 1;
    return acc;
  }, { "필수": 0, "선택": 0 });
}

function currentConditions() {
  return {
    range: state.range,
    duration: state.duration,
    searchStart: state.searchStart,
    searchEnd: state.searchEnd,
    required: people.filter((person) => person.role === "필수").map((person) => person.name).join(",")
  };
}

function rangeLabel() {
  return { "three-days": "3일 안으로", "week": "다음 주 안으로", "two-weeks": "2주 안으로", "custom": state.rangeCustom }[state.range];
}

function durationLabel() {
  return { "30": "30분", "45": "45분", "60": "1시간", "90": "1시간 30분" }[state.duration] || `${state.duration}분`;
}

function activeCandidates() {
  return scenarioCandidates[state.scenario];
}

function isBlocked() {
  if (state.scenario === "mixed") return false;
  if (state.scenario === "noRequired") return false;
  if (state.range === "three-days" && state.duration === "90") return true;
  return people.filter((person) => person.role === "필수").length >= 5 && state.range !== "two-weeks";
}

function applyScenarioDefaults(scenario) {
  state.scenario = scenario;
  state.searched = false;
  state.dirty = false;
  state.blocked = false;
  state.selected = 0;
  state.stage = "explore";
  state.searchStart = "오전 9:00";
  state.searchEnd = "오후 5:00";
  if (scenario === "mixed") {
    state.duration = "60";
    state.range = "week";
  }
  if (scenario === "noRequired") {
    state.duration = "90";
    state.range = "three-days";
  }
}

function selectedCandidate() {
  return activeCandidates()[state.selected] || activeCandidates()[0];
}

function selectedStrategy() {
  return adjustmentStrategies[state.adjustmentSelected] || adjustmentStrategies[0];
}

function setStage(stage) {
  state.stage = stage;
  render();
}

function renderNav() {
  const current = stages.findIndex(([key]) => key === state.stage);
  document.querySelector("#flowNav").innerHTML = stages.map(([key, label], index) => `
    <button class="${index === current ? "active" : ""} ${index < current ? "done" : ""}" type="button" data-stage="${key}">
      <span>${index < current ? "✓" : index + 1}</span>${label}
    </button>
  `).join("");
}

function peopleChips(role) {
  return people.filter((person) => person.role === role).map((person) => `<i title="${person.name}">${person.name.slice(-2)}</i>`).join("");
}

function conditionValue(label, value, action) {
  return `
    <button class="condition-value" type="button" data-action="${action}">
      <span>${label}</span>
      <strong>${value}</strong>
    </button>
  `;
}

function conditionCard() {
  return `
    <aside class="condition-card card">
      <section>
        <h3>테스트 시나리오</h3>
        <div class="scenario-toggle">
          <button class="${state.scenario === "mixed" ? "active" : ""}" type="button" data-scenario="mixed">2. 빠른 대안 포함</button>
          <button class="${state.scenario === "noRequired" ? "active" : ""}" type="button" data-scenario="noRequired">3. 필수 공통 없음</button>
        </div>
        <p class="scenario-help">${scenarioCopy[state.scenario].description}</p>
      </section>
      <section>
        <div class="section-head">
          <h3>참여 인원</h3>
          <button class="text-link" type="button" data-action="edit-people">편집</button>
        </div>
        <div class="person-row"><span>필수</span><div class="chips">${peopleChips("필수")}<button class="add-chip" type="button" data-action="edit-people">+</button></div></div>
        <div class="person-row"><span>선택</span><div class="chips optional">${peopleChips("선택")}</div></div>
      </section>
      <section>
        <h3>시간 조건</h3>
        ${conditionValue("미팅 길이", durationLabel(), "edit-duration")}
        ${conditionValue("일정 범위", rangeLabel(), "edit-range")}
        ${conditionValue("탐색 시간", `${state.searchStart} ~ ${state.searchEnd}`, "edit-search-time")}
      </section>
      <button class="primary full" type="button" data-action="search">가능한 일정 보기 →</button>
    </aside>
  `;
}

function calendar() {
  const days = ["월 13", "화 14", "수 15", "목 16", "금 17"];
  const allTimes = ["오전 9:00", "오전 10:00", "오전 11:00", "오후 12:00", "오후 1:00", "오후 2:00", "오후 3:00", "오후 4:00", "오후 5:00"];
  const startIndex = Math.max(0, allTimes.indexOf(state.searchStart));
  const endIndex = allTimes.indexOf(state.searchEnd) > -1 ? allTimes.indexOf(state.searchEnd) : allTimes.length - 1;
  const times = allTimes.slice(startIndex, Math.max(startIndex + 1, endIndex + 1));
  const picked = activeCandidates().reduce((acc, candidate, index) => {
    if (candidate.dayKey && candidate.start && days.includes(candidate.dayKey)) acc[`${candidate.dayKey}-${candidate.start}`] = index + 1;
    return acc;
  }, {});
  const possible = state.scenario === "mixed" ? { "화 14-오후 3:00": true, "목 16-오후 12:00": true, "금 17-오전 11:00": true } : {};
  const requiredConflicts = {
    "월 13-오전 9:00": "김민준: 주간 스탠드업",
    "월 13-오전 10:00": "박현수: 개발팀 싱크",
    "월 13-오전 11:00": "이지혜: 디자인 리뷰",
    "월 13-오후 12:00": "김민준: 점심 미팅",
    "월 13-오후 1:00": "박현수: 코드 리뷰",
    "월 13-오후 2:00": "이지혜: 사용자 인터뷰",
    "월 13-오후 3:00": "김민준: 우선순위 검토",
    "월 13-오후 4:00": "박현수: 배포 준비",
    "월 13-오후 5:00": "이지혜: 디자인 QA",
    "화 14-오전 9:00": "이지혜: 리서치 정리",
    "화 14-오전 11:00": "김민준: 로드맵 리뷰",
    "화 14-오후 12:00": "박현수: 점심 미팅",
    "화 14-오후 1:00": "김민준: 외부 미팅",
    "화 14-오후 2:00": "이지혜: 화면 검토",
    "화 14-오후 4:00": "박현수: 기술 검토",
    "화 14-오후 5:00": "김민준: 주간 보고",
    "수 15-오전 9:00": "박현수: 프론트엔드 챕터",
    "수 15-오전 10:00": "이지혜: 디자인 시스템 리뷰",
    "수 15-오전 11:00": "김민준: 기획 리뷰",
    "수 15-오후 12:00": "이지혜: 점심 미팅",
    "수 15-오후 1:00": "박현수: 코드 리뷰",
    "수 15-오후 3:00": "김민준: 정책 검토",
    "수 15-오후 4:00": "이지혜: 사용성 점검",
    "수 15-오후 5:00": "박현수: 배포 확인",
    "목 16-오전 9:00": "김민준: 그로스 리뷰",
    "목 16-오전 10:00": "이지혜: 디자인 리뷰",
    "목 16-오후 1:00": "박현수: 구현 검토",
    "목 16-오후 2:00": "이지혜: 디자인 리뷰",
    "목 16-오후 3:00": "김민준: KPI 리뷰",
    "목 16-오후 4:00": "박현수: 기술 부채 정리",
    "목 16-오후 5:00": "이지혜: 산출물 정리",
    "금 17-오전 9:00": "이지혜: 주간 회고",
    "금 17-오전 10:00": "박현수: 회고",
    "금 17-오후 12:00": "김민준: 점심 미팅",
    "금 17-오후 1:00": "이지혜: 디자인 QA",
    "금 17-오후 2:00": "박현수: 장애 대응",
    "금 17-오후 3:00": "김민준: 다음 스프린트 준비",
    "금 17-오후 4:00": "이지혜: 자료 정리",
    "금 17-오후 5:00": "박현수: 배포 마감"
  };
  const optionalConflicts = {
    "화 14-오전 10:00": "이서연: API 점검",
    "화 14-오후 3:00": "정수빈: 집중 업무",
    "목 16-오후 12:00": "최도윤: 데이터 정리",
    "금 17-오전 11:00": "이서연: 백엔드 주간 싱크"
  };
  return `
    <div class="calendar-grid ${state.showCalendarDetail ? "detail" : "compact"}">
      <div></div>
      ${days.map((day) => `<div class="day">${day}</div>`).join("")}
      ${times.map((time) => `
        <div class="time">${time}</div>
        ${days.map((day) => {
          const key = `${day}-${time}`;
          const rank = picked[key] || "";
          const label = rank === 1 ? "1순위" : rank ? `${rank}순위` : "";
          const requiredText = requiredConflicts[key] || "";
          const optionalText = optionalConflicts[key] || "";
          const className = rank === 1 ? "slot best" : rank ? "slot picked" : possible[key] ? "slot possible" : "slot unavailable";
          const detailText = state.showCalendarDetail ? (rank ? (rank === 3 ? optionalText : "모두 가능") : possible[key] ? `필수 가능 · ${optionalText}` : requiredText) : "";
          const candidateText = state.showCalendarDetail && label && !detailText ? (rank === 3 ? "선택 1명 불가" : "모두 가능") : "";
          return `<button class="${className}" type="button">${label ? `<strong>${label}</strong>` : ""}${detailText ? `<small>${candidateText || detailText}</small>` : ""}</button>`;
        }).join("")}
      `).join("")}
    </div>
  `;
}

function outsideCalendarNotice() {
  const outside = activeCandidates().filter((candidate) => candidate.dayKey && !["월 13", "화 14", "수 15", "목 16", "금 17"].includes(candidate.dayKey));
  if (!outside.length) return "";
  return `
    <div class="outside-calendar">
      ${outside.map((candidate) => `
        <span>${candidate.badge}</span>
        <strong>${candidate.time}</strong>
        <p>현재 캘린더 범위 밖 후보예요. ${candidate.cost}</p>
      `).join("")}
    </div>
  `;
}

function conditionChangeSuggestions() {
  return `
    <div class="condition-suggestions">
      <h4>그래도 어렵다면 조건을 바꿔 다시 찾아보세요</h4>
      <div>
        <button type="button" data-action="extend-range">일정 범위 늘리기</button>
        <button type="button" data-action="shorten">미팅 길이 줄이기</button>
        <button type="button" data-action="edit-people">필수/선택 다시 설정</button>
      </div>
    </div>
  `;
}

function recommendationStrip(list = activeCandidates()) {
  return `
    <div class="recommend-strip">
      ${list.map((candidate, index) => `
        <button class="${state.selected === index ? "selected" : ""} ${candidate.tone || ""}" type="button" data-pick="${index}">
          <span>${index === 0 ? "★" : index + 1}</span>
          <div>
            <strong>${candidate.short} · ${candidate.time.split("-")[0]}</strong>
            <small>${candidate.title}</small>
            <em>${candidate.meta.join(" · ")} · ${candidate.cost}</em>
          </div>
          <i>${candidate.badge}</i>
        </button>
      `).join("")}
    </div>
  `;
}

function candidateSummaryList() {
  return `
    <div class="candidate-summary-list">
      ${activeCandidates().map((candidate, index) => `
        <div>
          <b>${state.scenario === "noRequired" ? candidate.badge : `${index + 1}순위`}</b>
          <strong>${candidate.short} · ${candidate.time}</strong>
          <p>${candidate.title}<br>${candidate.meta.join(" · ")} · ${candidate.cost}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderExplore() {
  const content = !state.searched ? `
    <section class="empty-card card">
      <div>
        <h3>아직 가능한 일정을 찾지 않았어요</h3>
        <p>왼쪽 조건을 확인한 뒤 가능한 일정을 찾으면 추천 시간과 캘린더가 표시돼요.</p>
      </div>
    </section>
  ` : state.blocked ? `
    <section class="empty-card warn-card card">
      <div>
        <h3>현재 조건으로 가능한 시간이 없어요</h3>
        <p>필수 참석자 기준으로 먼저 막혔어요. 일정 범위를 늘리거나 미팅 길이를 줄여 다시 찾아보세요.</p>
        <div class="actions">
          <button class="secondary" type="button" data-action="extend-range">일정 범위 늘리기</button>
          <button class="secondary" type="button" data-action="shorten">45분으로 줄이기</button>
        </div>
      </div>
    </section>
  ` : `
    ${state.dirty ? `<div class="changed-banner"><span>조건이 변경됐어요. 현재 결과는 이전 조건 기준입니다.</span><button class="secondary" type="button" data-action="search">변경한 조건으로 다시 보기</button></div>` : ""}
    <section class="recommend-card card">
      <div class="card-head compact">
        <h3>${scenarioCopy[state.scenario].heading}</h3>
        <span class="soft-label">${scenarioCopy[state.scenario].label}</span>
      </div>
      ${recommendationStrip()}
      ${state.scenario === "noRequired" ? `<div class="inline-alert"><strong>아직 참석자에게 보낼 확정 후보가 없어요</strong><p>현재 조건 안에서 조정 요청 가능성이 있는 필수 참석자 일정만 조정안으로 보여줍니다.</p></div>${conditionChangeSuggestions()}` : `<div class="preview-box"><strong>이 3개 후보를 참석자에게 함께 확인해요</strong><p>참석자는 각 후보에 대해 가능, 비선호지만 가능, 조정 필요, 불가로 숨은 조건만 응답합니다.</p></div>`}
    </section>
    <section class="calendar-card card">
      <div class="card-head"><h3>캘린더</h3><label><input type="checkbox" data-control="calendar-detail" ${state.showCalendarDetail ? "checked" : ""}> 상세 일정</label></div>
      ${calendar()}
      ${outsideCalendarNotice()}
    </section>
    <div class="next-bar">
      <p>${state.scenario === "noRequired" ? "현재 조건 안에서 조정 요청 가능한 일정을 확인해요." : "추천 후보 3개를 참석자에게 보내기 전, 요청 정보를 작성해요."}</p>
      <button class="primary blue" type="button" data-action="${state.scenario === "noRequired" ? "to-adjust" : "to-details"}">${state.scenario === "noRequired" ? "조정안 보기" : "다음"}</button>
    </div>
  `;

  app.innerHTML = `
    <section class="page">
      <div class="page-title"><span class="eyebrow">C안 · 미팅 만들기</span><h2>미팅 일정 탐색</h2></div>
      <div class="layout">${conditionCard()}<main class="main">${content}</main></div>
    </section>
  `;
}

function requestInfoCard() {
  return `
    <aside class="condition-card card">
      <section>
        <h3>검토할 후보</h3>
        ${candidateSummaryList()}
      </section>
      <section>
        <h3>요청 기준</h3>
        <div class="person-row"><span>필수</span><div class="chips">${peopleChips("필수")}</div></div>
        <div class="person-row"><span>선택</span><div class="chips optional">${peopleChips("선택")}</div></div>
      </section>
      <button class="secondary full" type="button" data-action="back-explore">다시 시간 비교</button>
    </aside>
  `;
}

function roleReasonList() {
  return `
    <div class="reason-list">
      ${people.map((person) => `
        <div class="reason-row">
          <span class="avatar">${person.name.slice(-1)}</span>
          <div>
            <strong>${person.name} · ${person.role}</strong>
            <p>${person.detail}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDetails() {
  app.innerHTML = `
    <section class="page">
      <div class="page-title"><span class="eyebrow">요청 정보 작성</span><h2>참석자가 판단할 맥락을 완성해요</h2></div>
      <div class="layout">
        ${requestInfoCard()}
        <main class="main">
          <section class="form-card card">
            <div class="card-head compact"><h3>미팅 정보</h3><span class="soft-label">초대 전 필수</span></div>
            <div class="suggestions">
              <button type="button" data-purpose="구현 범위를 결정하고 다음 스프린트 착수 기준을 맞추기 위해">구현 범위 결정</button>
              <button type="button" data-purpose="AI 페이지 생성 정책과 예외 케이스 대응 기준을 합의하기 위해">정책 기준 합의</button>
              <button type="button" data-purpose="1차 출시 전에 디자인·개발·콘텐츠 관점의 리스크를 정리하기 위해">출시 리스크 정리</button>
            </div>
            <div class="form-grid">
              <label class="field wide"><span>미팅명</span><input id="titleInput" value="${state.meeting.title}"></label>
              <label class="field wide"><span>목적</span><textarea id="purposeInput">${state.meeting.purpose}</textarea></label>
              <label class="field"><span>응답 기한</span><input id="deadlineInput" value="${state.meeting.deadline}"></label>
              <label class="field"><span>요청 후보</span><input value="추천 후보 3개" readonly></label>
              <label class="field wide"><span>첨부 자료</span><input id="attachmentInput" value="${state.meeting.attachment}"></label>
            </div>
            <div class="info-panel">
              <strong>참석자별 필요한 이유</strong>
              <p>시간을 묻기 전에 “왜 내가 필요한지”를 먼저 보여줘 참석자가 조정 비용을 판단할 수 있게 해요.</p>
              ${roleReasonList()}
            </div>
            <div class="preview-box">
              <strong>참석자에게 보이는 요청</strong>
              <p>아래 3개 후보를 기준으로 캘린더에 없는 불가·비선호 또는 조정 필요 여부만 확인합니다. 아직 확정된 시간은 아니에요.</p>
            </div>
            <div class="actions">
              <button class="secondary" type="button" data-action="preview-attendee">참석자 화면 보기</button>
              <button class="primary blue" type="button" data-action="send-request">일정 검토 요청 보내기</button>
            </div>
          </section>
        </main>
      </div>
    </section>
  `;
}

function renderSent() {
  app.innerHTML = `
    <section class="page">
      <section class="sent-hero card">
        <div class="success-mark">✓</div>
        <h2>일정 검토 요청을 보냈어요</h2>
        <p style="color:var(--muted);margin-top:8px">참석자는 미팅 목적과 자신의 필요 이유를 보고, 캘린더에 없는 조건만 응답합니다.</p>
        <div class="mini-policy">
          <span>가능</span><span>비선호지만 가능</span><span>조정 필요</span><span>불가</span>
        </div>
        <div class="actions" style="justify-content:center">
          <button class="secondary" type="button" data-action="preview-attendee">참석자 응답 화면 보기</button>
          <button class="primary blue" type="button" data-action="to-responses">응답 현황 보기</button>
        </div>
      </section>
    </section>
  `;
}

function responseData() {
  if (state.responseMode === "pending") {
    return [
      ["이지혜", "필수", "가능", "ok", "추가 조건 없음"],
      ["김민준", "필수", "확인 중", "pending", "기존 회의 조정 여부 응답 전"],
      ["박현수", "필수", "가능", "ok", "추가 조건 없음"],
      ["이서연", "선택", "불가", "no", "해당 시간에 기존 회의"],
      ["정수빈", "선택", "비선호지만 가능", "warn", "집중 업무 시간이라 가능하면 피하고 싶음"],
      ["최도윤", "선택", "미응답", "pending", "응답 전"]
    ];
  }
  return [
    ["이지혜", "필수", "가능", "ok", "추가 조건 없음"],
    ["김민준", "필수", "조정 필요", "warn", "기존 회의를 옮기면 참석 가능"],
    ["박현수", "필수", "가능", "ok", "추가 조건 없음"],
    ["이서연", "선택", "불가", "no", "해당 시간에 기존 회의"],
    ["정수빈", "선택", "비선호지만 가능", "warn", "집중 업무 시간이라 가능하면 피하고 싶음"],
    ["최도윤", "선택", state.responseMode === "ready" ? "가능" : "미응답", state.responseMode === "ready" ? "ok" : "pending", state.responseMode === "ready" ? "자료 공유 받으면 참석 가능" : "응답 전"]
  ];
}

function responseRows() {
  return responseData().map((row) => `
    <div class="status-row">
      <span class="avatar">${row[0].slice(-1)}</span>
      <div><strong>${row[0]} · ${row[1]}</strong><p>${row[4]}</p></div>
      <span class="status ${row[3]}">${row[2]}</span>
    </div>
  `).join("");
}

function responseSideNote() {
  if (state.responseMode === "pending") {
    return `
      <h3>아직 확정할 수 없어요</h3>
      <p>필수 참석자의 확인 중 상태는 가능으로 간주하지 않아요. 미응답과 조정 필요는 분리해서 봐야 합니다.</p>
      <div class="stack-actions">
        <button class="secondary full" type="button" data-action="remind">미응답 리마인드 보내기</button>
        <button class="secondary full" type="button" data-action="pass-deadline">응답 기한이 지난 상황 보기</button>
        <button class="primary blue full" type="button" data-action="simulate-response">샘플 응답 완료하기</button>
      </div>
    `;
  }
  if (state.responseMode === "deadline") {
    return `
      <h3>기한이 지났다면</h3>
      <p>필수 참석자 응답이 없으면 자동 확정하지 않고, 주최자가 다음 행동을 선택해야 해요.</p>
      <div class="deadline-options">
        <button type="button" data-action="extend-deadline">응답 기한 연장</button>
        <button type="button" data-action="ask-again">다시 요청</button>
        <button type="button" data-action="host-confirm">직접 확인 후 입력</button>
        <button type="button" data-action="role-downgrade">필수에서 선택으로 변경</button>
      </div>
    `;
  }
  return `
    <h3>조정 필요가 남아 있어요</h3>
    <p>김민준 님은 참석 가능성이 있지만 기존 일정 조정이 필요합니다. 이 응답은 확정 동의가 아니므로 조정안을 검토해야 해요.</p>
    <div class="stack-actions">
      <button class="primary blue full" type="button" data-action="to-adjust">AI 조정안 보기</button>
    </div>
  `;
}

function renderResponses() {
  const title = state.responseMode === "pending" ? "필수 참석자 1명이 아직 확인 중이에요" : state.responseMode === "deadline" ? "기한이 지나도 자동 확정하지 않아요" : "응답을 반영해 조정 필요를 확인했어요";
  app.innerHTML = `
    <section class="page">
      <div class="page-title"><span class="eyebrow">응답 현황</span><h2>${title}</h2></div>
      <div class="two-col">
        <section class="status-card card">
          <div class="card-head compact"><h3>참석자 응답</h3><span class="soft-label">미응답·비선호·조정 필요 분리</span></div>
          <div class="status-list">${responseRows()}</div>
        </section>
        <aside class="side-note">${responseSideNote()}</aside>
      </div>
    </section>
  `;
}

function renderAdjust() {
  app.innerHTML = `
    <section class="page">
      <div class="page-title"><span class="eyebrow">조정안 검토</span><h2>현재 조건 안에서 조정 요청 가능한 일정을 찾았어요</h2></div>
      <div class="two-col">
        <section class="final-card card">
          <div class="inline-alert">
            <strong>성립 조건</strong>
            <p>필수 참석자의 겹친 일정이 다른 회의에서 선택 참석자인 경우에만 조정안으로 제안합니다.</p>
          </div>
          <div class="strategy-list">
            ${adjustmentStrategies.map((strategy, index) => `
              <button class="strategy-card ${state.adjustmentSelected === index ? "selected" : ""}" type="button" data-strategy="${index}">
                <span>${index + 1}</span>
                <div>
                  <strong>${strategy.title}</strong>
                  <p>${strategy.summary}</p>
                  <em>${strategy.cost}</em>
                </div>
                <b>${strategy.label}</b>
              </button>
            `).join("")}
          </div>
          ${conditionChangeSuggestions()}
          <div class="actions"><button class="primary blue" type="button" data-action="to-final">선택한 조정안으로 최종 추천 보기</button></div>
        </section>
        <aside class="side-note">
          <h3>제품의 역할</h3>
          <p>제품은 조정 가능성이 있는 충돌 일정을 찾아 보여줍니다. 조정 요청 여부와 최종 확정은 주최자가 판단해요.</p>
          <div class="preview-box">
            <strong>${selectedStrategy().label}</strong>
            <p>${selectedStrategy().note}</p>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function finalOptions() {
  const strategy = selectedStrategy();
  return [
    {
      date: "7월 14일 화요일",
      time: "오전 10:00-11:00",
      reason: `필수 3명 전원 참여 가능 · ${strategy.label} · 김민준 일정 조정 요청 필요`,
      badge: "조정 요청 필요"
    }
  ];
}

function renderFinal() {
  const options = finalOptions();
  app.innerHTML = `
    <section class="page">
      <div class="page-title"><span class="eyebrow">최종 추천</span><h2>응답과 조정 비용을 반영해 확정 후보를 정리했어요</h2></div>
      <div class="two-col">
        <section class="final-card card">
          <div class="card-head compact"><h3>추천 순서</h3><span class="soft-label">자동 확정 아님</span></div>
          <div class="final-list">
            ${options.map((option, index) => `
              <button class="final-option ${state.finalSelected === index ? "selected" : ""}" type="button" data-final-pick="${index}">
                <span>${index + 1}</span>
                <div><strong>${option.date} · ${option.time}</strong><p>${option.reason}</p></div>
                <em class="pill ${index === 1 ? "warn" : ""}">${option.badge}</em>
              </button>
            `).join("")}
          </div>
          <div class="preview-box">
            <strong>선택한 조정안</strong>
            <p>${selectedStrategy().title} · ${selectedStrategy().cost}</p>
          </div>
          <div class="actions"><button class="primary blue" type="button" data-action="confirm-final">이 시간으로 확정하기</button></div>
        </section>
        <aside class="side-note">
          <h3>확정 전 기준</h3>
          <p>추천은 자동 확정이 아니라 주최자의 최종 판단을 돕는 정보입니다. 불가, 비선호, 조정 필요, 선택 참석자 불참을 구분해서 설명해요.</p>
        </aside>
      </div>
    </section>
  `;
}

function renderSuccess() {
  const option = finalOptions()[state.finalSelected];
  app.innerHTML = `
    <section class="page">
      <section class="sent-hero card">
        <div class="success-mark">✓</div>
        <h2>${option.date}<br>${option.time}</h2>
        <p style="color:var(--muted);margin-top:8px">6명에게 확정 시간을 공유했고 캘린더 초대를 보냈어요.</p>
        <div class="preview-box" style="max-width:560px;margin:22px auto 0;text-align:left">
          <strong>공유 메시지</strong>
          <p>필수 참석자가 참여 가능한 시간 중 ${selectedStrategy().label} 기준을 반영해 확정했어요. 비선호 또는 불참 비용이 있는 참석자에게는 결정 이유와 공유 자료를 함께 보냅니다.</p>
        </div>
        <div class="actions" style="justify-content:center"><button class="secondary" type="button" data-action="restart">새 미팅 만들기</button></div>
      </section>
    </section>
  `;
}

function render() {
  renderNav();
  if (state.stage === "explore") renderExplore();
  if (state.stage === "details") renderDetails();
  if (state.stage === "sent") renderSent();
  if (state.stage === "responses") renderResponses();
  if (state.stage === "adjust") renderAdjust();
  if (state.stage === "final") renderFinal();
  if (state.stage === "success") renderSuccess();
}

function search() {
  state.searched = true;
  state.dirty = false;
  state.selected = 0;
  state.lastConditions = currentConditions();
  state.blocked = isBlocked();
  render();
}

function markDirty() {
  if (!state.searched) return;
  state.dirty = JSON.stringify(currentConditions()) !== JSON.stringify(state.lastConditions);
  render();
}

function showModal(content, size = "") {
  const dialog = document.querySelector("#dialog");
  dialog.classList.toggle("wide", size === "wide");
  dialog.innerHTML = content;
  document.querySelector("#modal").classList.remove("hidden");
  document.querySelector("#modal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  document.querySelector("#dialog").classList.remove("wide");
  document.querySelector("#modal").classList.add("hidden");
  document.querySelector("#modal").setAttribute("aria-hidden", "true");
}

function optionButton(group, value, label, selected) {
  return `<button class="${selected ? "selected" : ""}" type="button" data-${group}="${value}">${label}</button>`;
}

function durationEditor() {
  const presets = [
    ["30", "30분"],
    ["45", "45분"],
    ["60", "1시간"],
    ["90", "1시간 30분"]
  ];
  return `
    <span class="eyebrow">미팅 길이</span>
    <h3>얼마나 진행할까요?</h3>
    <p>자주 쓰는 길이는 바로 고르고, 필요한 경우 분 단위로 직접 입력할 수 있어요.</p>
    <div class="option-grid">
      ${presets.map(([value, label]) => optionButton("duration", value, label, state.duration === value)).join("")}
    </div>
    <label class="field modal-field"><span>직접 입력</span><input id="durationCustomInput" type="number" min="10" max="240" step="5" value="${state.duration}" placeholder="예: 75"></label>
    <div class="dialog-actions">
      <button class="secondary" type="button" data-action="apply-duration-custom">직접 입력 적용</button>
      <button class="primary blue" type="button" data-close>완료</button>
    </div>
  `;
}

function rangeEditor() {
  const presets = [
    ["three-days", "3일 안으로"],
    ["week", "다음 주 안으로"],
    ["two-weeks", "2주 안으로"]
  ];
  return `
    <span class="eyebrow">일정 범위</span>
    <h3>어느 기간에서 찾을까요?</h3>
    <p>빠르게 고를 수 있는 프리셋과 직접 입력을 함께 둬서, 주최자가 다시 화면을 이동하지 않고 조건을 바꿀 수 있게 했어요.</p>
    <div class="option-grid">
      ${presets.map(([value, label]) => optionButton("range", value, label, state.range === value)).join("")}
    </div>
    <label class="field modal-field wide"><span>직접 입력</span><input id="rangeCustomInput" value="${state.rangeCustom}" placeholder="예: 7월 13일(월) - 7월 17일(금)"></label>
    <div class="dialog-actions">
      <button class="secondary" type="button" data-action="apply-range-custom">직접 입력 적용</button>
      <button class="primary blue" type="button" data-close>완료</button>
    </div>
  `;
}

function searchTimeEditor() {
  const times = ["오전 9:00", "오전 10:00", "오전 11:00", "오후 12:00", "오후 1:00", "오후 2:00", "오후 3:00", "오후 4:00", "오후 5:00"];
  return `
    <span class="eyebrow">탐색 시간</span>
    <h3>하루 중 어느 시간에서 찾을까요?</h3>
    <p>업무 시간처럼 자주 쓰는 범위는 프리셋으로, 필요하면 시작·종료 시간을 직접 골라요.</p>
    <div class="time-presets">
      <button type="button" data-time-preset="workday">오전 9:00 ~ 오후 5:00</button>
      <button type="button" data-time-preset="morning">오전만</button>
      <button type="button" data-time-preset="afternoon">오후만</button>
    </div>
    <div class="time-range-editor">
      <label><span>시작</span><select id="searchStartInput">${times.map((time) => `<option ${state.searchStart === time ? "selected" : ""}>${time}</option>`).join("")}</select></label>
      <i>→</i>
      <label><span>종료</span><select id="searchEndInput">${times.map((time) => `<option ${state.searchEnd === time ? "selected" : ""}>${time}</option>`).join("")}</select></label>
    </div>
    <div class="dialog-actions">
      <button class="secondary" type="button" data-action="apply-search-time">탐색 시간 적용</button>
      <button class="primary blue" type="button" data-close>완료</button>
    </div>
  `;
}

function peopleEditor() {
  return `
    <button class="modal-close" type="button" data-close>×</button>
    <h3>참여 인원을 선택해 주세요</h3>
    <div class="host-card">
      <span>주최자</span>
      <div><span class="avatar host">혜</span><strong>이지혜</strong><p>제품팀 · 프로덕트 디자이너</p></div>
    </div>
    <div class="participant-card">
      <span>참여자</span>
      <label class="search-field"><i>⌕</i><input placeholder="이름, 팀, 역할로 검색"></label>
      <div class="selected-summary"><strong>총 ${people.length}명 선택됨</strong><button type="button" data-action="clear-optional">선택 참석자 지우기</button></div>
      <div class="modal-people-list">
        ${people.map((person, index) => `
          <div class="person">
            <span class="avatar">${person.name.slice(-1)}</span>
            <div><strong>${person.name}</strong><p>${person.job} · ${person.calendar}</p></div>
            <div class="segmented" data-index="${index}">
              ${["필수", "선택"].map((role) => `<button class="${person.role === role ? "active" : ""}" type="button" data-role="${role}">${role}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="dialog-actions"><button class="primary full" type="button" data-close>선택 완료</button></div>
  `;
}

function attendeePreview() {
  const me = people[1];
  return `
    <span class="eyebrow">참석자 화면</span>
    <h3>${state.meeting.title}</h3>
    <p>${state.meeting.purpose}</p>
    <div class="preview-box">
      <strong>${me.name} 님이 필요한 이유</strong>
      <p>${me.detail}</p>
    </div>
    <div class="preview-box">
      <strong>검토할 후보 3개</strong>
      <p>확정된 일정이 아니에요. 각 후보에 대해 캘린더에 없는 불가·비선호 또는 조정 필요 여부만 답해주세요.</p>
    </div>
    ${candidateSummaryList()}
    <div class="response-option-grid">
      <button type="button">가능</button>
      <button type="button">비선호지만 가능</button>
      <button type="button">조정 필요</button>
      <button type="button">불가</button>
    </div>
    <div class="inline-alert small">
      <strong>조정 필요는 확정 동의가 아니에요</strong>
      <p>기존 일정을 옮길 수 있는지 주최자가 다시 확인해야 합니다.</p>
    </div>
    <div class="dialog-actions"><button class="primary blue" type="button" data-close>확인</button></div>
  `;
}

function toast(message) {
  const toastEl = document.querySelector("#toast");
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 1700);
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "search") search();
  if (action === "extend-range") { state.range = "two-weeks"; search(); }
  if (action === "shorten") { state.duration = "45"; search(); }
  if (action === "edit-people") showModal(peopleEditor(), "wide");
  if (action === "edit-duration") showModal(durationEditor());
  if (action === "edit-range") showModal(rangeEditor());
  if (action === "edit-search-time") showModal(searchTimeEditor());
  if (action === "apply-duration-custom") {
    const value = Number(document.querySelector("#durationCustomInput")?.value);
    if (value >= 10 && value <= 240) {
      state.duration = String(value);
      markDirty();
      showModal(durationEditor());
    }
  }
  if (action === "apply-range-custom") {
    const value = document.querySelector("#rangeCustomInput")?.value.trim();
    if (value) {
      state.range = "custom";
      state.rangeCustom = value;
      markDirty();
      showModal(rangeEditor());
    }
  }
  if (action === "apply-search-time") {
    const start = document.querySelector("#searchStartInput")?.value || state.searchStart;
    const end = document.querySelector("#searchEndInput")?.value || state.searchEnd;
    const order = ["오전 9:00", "오전 10:00", "오전 11:00", "오후 12:00", "오후 1:00", "오후 2:00", "오후 3:00", "오후 4:00", "오후 5:00"];
    state.searchStart = start;
    state.searchEnd = order.indexOf(end) >= order.indexOf(start) ? end : start;
    markDirty();
    showModal(searchTimeEditor());
  }
  if (action === "clear-optional") {
    people.forEach((person) => { if (person.role === "선택") person.role = "필수"; });
    document.querySelector("#dialog").innerHTML = peopleEditor();
    markDirty();
  }
  if (action === "to-details") setStage("details");
  if (action === "back-explore") setStage("explore");
  if (action === "preview-attendee") showModal(attendeePreview());
  if (action === "send-request") {
    state.meeting.title = document.querySelector("#titleInput")?.value || state.meeting.title;
    state.meeting.purpose = document.querySelector("#purposeInput")?.value || state.meeting.purpose;
    state.meeting.deadline = document.querySelector("#deadlineInput")?.value || state.meeting.deadline;
    state.meeting.attachment = document.querySelector("#attachmentInput")?.value || state.meeting.attachment;
    state.responseMode = "pending";
    setStage("sent");
  }
  if (action === "to-responses") setStage("responses");
  if (action === "remind") toast("김민준, 최도윤 님에게 리마인드를 보냈어요.");
  if (action === "pass-deadline") { state.responseMode = "deadline"; render(); }
  if (action === "extend-deadline") toast("응답 기한을 2시간 연장했어요.");
  if (action === "ask-again") toast("필수 참석자에게 다시 요청했어요.");
  if (action === "host-confirm") { state.responseMode = "ready"; toast("직접 확인한 응답을 반영했어요."); render(); }
  if (action === "role-downgrade") { people[1].role = "선택"; state.responseMode = "ready"; toast("김민준 님을 선택 참석자로 변경했어요."); render(); }
  if (action === "simulate-response") { state.responseMode = "ready"; render(); }
  if (action === "to-adjust") setStage("adjust");
  if (action === "to-final") setStage("final");
  if (action === "confirm-final") setStage("success");
  if (action === "restart") {
    state.stage = "explore";
    state.searched = false;
    state.dirty = false;
    state.blocked = false;
    state.responseMode = "pending";
    state.selected = 0;
    state.finalSelected = 0;
    state.adjustmentSelected = 0;
    render();
  }
  if (event.target.closest("[data-close]")) closeModal();

  const pick = event.target.closest("[data-pick]");
  if (pick) { state.selected = Number(pick.dataset.pick); render(); }
  const finalPick = event.target.closest("[data-final-pick]");
  if (finalPick) { state.finalSelected = Number(finalPick.dataset.finalPick); render(); }
  const strategy = event.target.closest("[data-strategy]");
  if (strategy) { state.adjustmentSelected = Number(strategy.dataset.strategy); render(); }
  const purpose = event.target.closest("[data-purpose]");
  if (purpose) {
    const input = document.querySelector("#purposeInput");
    if (input) input.value = purpose.dataset.purpose;
  }
  const duration = event.target.closest("[data-duration]");
  if (duration) {
    state.duration = duration.dataset.duration;
    markDirty();
    showModal(durationEditor());
  }
  const range = event.target.closest("[data-range]");
  if (range) {
    state.range = range.dataset.range;
    markDirty();
    showModal(rangeEditor());
  }
  const timePreset = event.target.closest("[data-time-preset]");
  if (timePreset) {
    if (timePreset.dataset.timePreset === "workday") {
      state.searchStart = "오전 9:00";
      state.searchEnd = "오후 5:00";
    }
    if (timePreset.dataset.timePreset === "morning") {
      state.searchStart = "오전 9:00";
      state.searchEnd = "오후 12:00";
    }
    if (timePreset.dataset.timePreset === "afternoon") {
      state.searchStart = "오후 1:00";
      state.searchEnd = "오후 5:00";
    }
    markDirty();
    showModal(searchTimeEditor());
  }

  const stage = event.target.closest("[data-stage]")?.dataset.stage;
  if (stage) setStage(stage);

  const scenario = event.target.closest("[data-scenario]");
  if (scenario) {
    applyScenarioDefaults(scenario.dataset.scenario);
    render();
  }

  const roleButton = event.target.closest("[data-role]");
  if (roleButton) {
    const index = Number(roleButton.closest("[data-index]").dataset.index);
    people[index].role = roleButton.dataset.role;
    document.querySelector("#dialog").innerHTML = peopleEditor();
    markDirty();
  }
});

document.addEventListener("change", (event) => {
  const control = event.target.closest("[data-control]");
  if (!control) return;
  if (control.dataset.control === "range") state.range = control.value;
  if (control.dataset.control === "duration") state.duration = control.value;
  if (control.dataset.control === "calendar-detail") {
    state.showCalendarDetail = control.checked;
    render();
    return;
  }
  markDirty();
});

document.querySelector("#modalBackdrop").addEventListener("click", closeModal);
document.querySelector("#resetButton").addEventListener("click", () => {
  state.stage = "explore";
  state.searched = false;
  state.dirty = false;
  state.blocked = false;
  state.responseMode = "pending";
  state.selected = 0;
  state.finalSelected = 0;
  state.adjustmentSelected = 0;
  state.range = "week";
  state.duration = "60";
  state.rangeCustom = "7월 13일(월) - 7월 17일(금)";
  state.searchStart = "오전 9:00";
  state.searchEnd = "오후 5:00";
  people[1].role = "필수";
  render();
});

render();
