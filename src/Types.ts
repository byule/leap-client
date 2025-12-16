import "@mkellsy/hap-device";

/**
 * Extends the TriggerOptions interface to add triggerOn configuration
 */
declare module "@mkellsy/hap-device" {
    export interface TriggerOptions {
        /**
         * Specifies which hardware event(s) trigger button actions.
         * - 'press': Only Press events trigger actions (no Release needed)
         * - 'release': Only Release events trigger actions (no Press needed)
         * - 'pressAndRelease': Both Press and Release events are used (full state machine)
         */
        triggerOn?: "press" | "release" | "pressAndRelease";
    }

    export interface Button {
        /**
         * Whether this button supports long press functionality
         */
        supportsLongPress?: boolean;
    }
}
