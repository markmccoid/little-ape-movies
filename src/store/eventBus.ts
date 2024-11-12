/**
 * eventBus.ts
 * Helps with interactions between stores / files that may otherwise
 * cause a "required cycle" error.
 *
 */
type Listener = (...args: any[]) => void;
type Events =
  | "TAG_SEARCH_RESULTS"
  | "CLEAR_SEARCH_STORES"
  | "GET_SHOW_COLORS"
  | "UPDATE_SHOW_PROVIDERS"
  | "GENERATE_GENRES_ARRAY";
class EventBus {
  private listeners: { [event: string]: Listener[] } = {};
  // Subscribe is like "on"  This is where we setup what we are going to do
  // when an event happens
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
  // This is like emitting an event
  publish(event: Events, ...args: any[]) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((callback) => callback(...args));
  }
}

export const eventBus = new EventBus();
