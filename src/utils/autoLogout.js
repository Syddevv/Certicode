let logoutTimer;

export const setupAutoLogout = (logoutCallback, timeoutMinutes = 60) => {
  const resetTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    
    logoutTimer = setTimeout(() => {
      logoutCallback();
    }, timeoutMinutes * 60 * 1000);
  };

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  const handleActivity = () => {
    resetTimer();
  };

  events.forEach(event => {
    document.addEventListener(event, handleActivity);
  });

  resetTimer();

  return () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    events.forEach(event => {
      document.removeEventListener(event, handleActivity);
    });
  };
};