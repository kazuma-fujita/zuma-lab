import { RefObject } from 'react';
import { createRef, useCallback } from 'react';

export const useScrollToTop = (): {
  ref: RefObject<HTMLDivElement>;
  scrollToTop: () => void;
} => {
  // 使う側はスクロールさせたい場所にある Element にrefをセット
  const ref = createRef<HTMLDivElement>();
  // 使う側はuseEffect内でscrollToTopを呼び出す
  const scrollToTop = useCallback(() => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [ref]);
  return { ref, scrollToTop };
};
