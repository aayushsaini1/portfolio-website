export function observeAnimationVisibility(element, onChange) {
  // Resume just outside the viewport; retain animation state across pauses.
  let isIntersecting = true;
  let isActive;
  let disposed = false;

  const notify = () => {
    if (disposed) return;
    const nextActive = isIntersecting && !document.hidden;
    if (nextActive === isActive) return;
    isActive = nextActive;
    onChange(nextActive);
  };

  const observer = new IntersectionObserver(([entry]) => {
    isIntersecting = entry.isIntersecting;
    notify();
  }, { rootMargin: '100px 0px' });

  observer.observe(element);
  document.addEventListener('visibilitychange', notify);
  notify();

  return () => {
    disposed = true;
    observer.disconnect();
    document.removeEventListener('visibilitychange', notify);
  };
}
