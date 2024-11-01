import { sessionViewModel } from './types';

export function sessionMapper(sessions: any[]): sessionViewModel[] {
  const sessionsViewModel = [];
  for (let i = 0; i < sessions.length; i++) {
    sessionsViewModel.push({
      ip: sessions[i].ip,
      title: sessions[i].deviceName,
      lastActiveDate: sessions[i].lastActiveDate,
      deviceId: sessions[i].deviceId,
    });
  }
  return sessionsViewModel;
}
