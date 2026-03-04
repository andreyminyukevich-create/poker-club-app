import { useState, useEffect } from 'react';

export default function useTelegram() {
  var tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

  useEffect(function() {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setBackgroundColor('#1B2D5E');
      tg.setHeaderColor('#1B2D5E');
      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      }
      if (tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes();
      }
    }
  }, []);

  var user = tg?.initDataUnsafe?.user || null;
  var initData = tg?.initData || '';

  return { tg: tg, user: user, initData: initData };
}
