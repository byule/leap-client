import { Button, TriggerOptions } from "@mkellsy/hap-device";
import { EventEmitter } from "@mkellsy/event-emitter";
import { ButtonAddress } from "../../Response/ButtonAddress";
import { ButtonStatus } from "../../Response/ButtonStatus";
import { Processor } from "../Processor/Processor";
import { Trigger } from "./Trigger";
/**
 * Defines a button tracker. This enables single, double and long presses on
 * remotes.
 * @public
 */
export declare class TriggerController extends EventEmitter<{
    Press: (button: Button) => void;
    DoublePress: (button: Button) => void;
    LongPress: (button: Button) => void;
}> implements Trigger {
    private processor;
    private action;
    private options;
    private timer?;
    private state;
    private button;
    private index;
    /**
     * Creates a button tracker.
     *
     * @param processor A refrence to the processor.
     * @param button A reference to the individual button.
     * @param index An index of the button on the device.
     * @param options Button options like click speed, raise or lower.
     */
    constructor(processor: Processor, button: ButtonAddress, index: number, options?: Partial<TriggerOptions>);
    /**
     * The button id.
     *
     * @returns A string of the button id.
     */
    get id(): string;
    /**
     * The definition of the button.
     *
     * @returns A button object.
     */
    get definition(): Button;
    /**
     * Resets the button state to idle.
     */
    reset(): void;
    /**
     * Updates the button state and tracks single, double or long presses.
     *
     * @param status The current button status.
     */
    update(status: ButtonStatus): void;
}
//# sourceMappingURL=TriggerController.d.ts.map