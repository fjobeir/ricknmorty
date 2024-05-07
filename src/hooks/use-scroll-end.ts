import { useEffect, useRef } from 'react';

function useScrollEnd(callback: () => void, delay: number = 200) {
  const targetRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
     // If target element is not available, do nothing
    if (!targetRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback();
      }, delay);
    };

    targetRef.current.addEventListener('scrollend', handleScroll);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      targetRef.current?.removeEventListener('scrollend', handleScroll);
    };
  }, [callback, delay]);

  return targetRef;
}

export default useScrollEnd;
