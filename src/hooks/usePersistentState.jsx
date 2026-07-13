import { useState, useEffect } from 'react';

/**
 * usePersistentState - 값을 sessionStorage에 동기화하는 useState 래퍼
 *
 * 새로고침 시에도 값이 유지되어 진행 중이던 플로우 상태를 복원한다.
 * 탭 세션 단위로 저장되므로, 새 탭/새 세션에서는 초기값(홈)부터 시작한다.
 *
 * @param {string} key - sessionStorage 저장 키 [Required]
 * @param {*} initialValue - 저장된 값이 없을 때 사용할 초기값 [Required]
 * @returns {[*, function]} [state, setState] — useState와 동일한 시그니처
 *
 * Example usage:
 * const [page, setPage] = usePersistentState('meetfit:page', 'intro');
 */
function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored != null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      /** 저장 실패(시크릿 모드 등)는 무시하고 인메모리 상태로만 동작한다 */
    }
  }, [key, state]);

  return [state, setState];
}

export { usePersistentState };
