import { ToastService } from './toastService';
import { Howl } from 'howler';

// Simple notification sounds using system beep sound URLs
const sound = new Howl({
    src: ['https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', '/notification.mp3'],
    html5: true
});

/**
 * Simple focus session notification service
 */
export const focusNotificationService = {
    notifySessionStarted(habitName: string, duration: number) {
        try {
            sound.play();
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
        ToastService.success(`${habitName} - ${duration}min session`, 'Focus Started');
    },

    notifySessionPaused(habitName: string) {
        try {
            sound.play();
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
        ToastService.info(`${habitName} - Take a break`, 'Session Paused');
    },

    notifySessionResumed(habitName: string) {
        try {
            sound.play();
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
        ToastService.success(`${habitName} - Back to work!`, 'Session Resumed');
    },

    notifySessionCompleted(habitName: string, actualMinutes: number) {
        try {
            sound.play();
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
        ToastService.success(`${habitName} - ${actualMinutes}min completed`, 'Session Complete!');
    },

    notifySessionCancelled(habitName: string) {
        ToastService.warning(`${habitName} - Try again later`, 'Session Cancelled');
    },

    notifyCountdownWarning(timeLeft: string) {
        try {
            sound.play();
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
        ToastService.warning(`${timeLeft} remaining`);
    },

    createPersistentNotification(habitName: string, timeLeft: string) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Focus: ${habitName}`, {
                body: `${timeLeft} remaining`,
                tag: 'focus-session'
            });
        }
    }
};