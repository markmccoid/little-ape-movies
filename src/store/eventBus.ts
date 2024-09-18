/**
 * eventBus.ts
 * Helps with interactions between stores / files that may otherwise
 * cause a "required cycle" error.
 *
 */
type Listener = (...args: any[]) => void;
type Events = "TAG_SEARCH_RESULTS" | "CLEAR_SEARCH_STORES";
class EventBus {
  private listeners: { [event: string]: Listener[] } = {};

  subscribe(event: Events, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    // Return an unsubscribe function
    return () => {
      // console.log("UNSUB", this.listeners[event].length);
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
      // console.log("AFTERUNSUB", this.listeners[event].length);
    };
  }

  publish(event: Events, ...args: any[]) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((callback) => callback(...args));
  }
}

export const eventBus = new EventBus();
