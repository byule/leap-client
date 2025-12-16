/**
 * Configuration for individual button trigger behavior
 */
export interface ButtonConfig {
    /**
     * Specifies which hardware event(s) trigger button actions.
     * - 'press': Only Press events trigger actions
     * - 'release': Only Release events trigger actions (default)
     * - 'pressAndRelease': Both Press and Release events are used for full state machine
     */
    triggerOn?: "press" | "release" | "pressAndRelease";
}

/**
 * Configuration for the leap-client
 */
export interface LeapConfig {
    /**
     * Button-specific configuration mapped by button name
     * Example: { "Goodbye": { "triggerOn": "press" } }
     */
    buttonConfig?: { [buttonName: string]: ButtonConfig };
}
