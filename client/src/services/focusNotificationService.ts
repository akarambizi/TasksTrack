import { ToastService } from './toastService';
import { Howl } from 'howler';

// Simple notification sound using clean embedded audio
const sound = new Howl({
    src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyvnc+BSWN2PTjgSYEC3bN6d2QQgwVXajk4qpXFwY9kNLz2YJJBxN/yOByhzEJEXLH8+OVSA0RXKfb56xdIAVIjdz1x4w2ChN5v+R6kzwLH2O76+KyaB4CMHu96YM'],
    html5: true,
    volume: 0.3
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