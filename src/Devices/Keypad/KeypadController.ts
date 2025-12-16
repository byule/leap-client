import Colors from "colors";

import { Button, DeviceType } from "@mkellsy/hap-device";

import "../../Types";
import { AreaAddress } from "../../Response/AreaAddress";
import { ButtonAddress } from "../../Response/ButtonAddress";
import { ButtonStatus } from "../../Response/ButtonStatus";
import { Common } from "../Common";
import { DeviceAddress } from "../../Response/DeviceAddress";
import { Keypad } from "./Keypad";
import { KeypadState } from "./KeypadState";
import { LeapConfig } from "../../Config";
import { Processor } from "../Processor/Processor";
import { TriggerController } from "../Remote/TriggerController";

/**
 * Defines a keypad device.
 * @public
 */
export class KeypadController extends Common<KeypadState> implements Keypad {
    public readonly buttons: Button[] = [];
    private readonly triggers: TriggerController[] = [];
    private readonly config: LeapConfig;
    private initPromise?: Promise<void>;

    /**
     * Creates a keypad device.
     *
     * ```js
     * const keypad = new Keypad(processor, area, device, config);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param device A refrence to this device.
     * @param config Configuration for button behavior.
     */
    constructor(processor: Processor, area: AreaAddress, device: DeviceAddress, config?: LeapConfig) {
        super(DeviceType.Keypad, processor, area, device, {
            led: { href: "/unknown" },
            state: "Off",
        });

        this.config = config || {};

        if (
            device.DeviceType === "SunnataKeypad" ||
            device.DeviceType === "SunnataHybridKeypad" ||
            device.DeviceType === "PalladiomKeypad"
        ) {
            this.log.info(Colors.cyan(`KeypadController: Initializing ${device.DeviceType} at ${this.address.href}`));

            // Store the initialization promise so it can be awaited
            this.initPromise = this.processor
                .buttons(this.address)
                .then((groups) => {
                    this.log.info(Colors.cyan(`KeypadController: Retrieved ${groups?.length || 0} button groups`));

                    for (let i = 0; i < groups?.length; i++) {
                        for (let j = 0; j < groups[i].Buttons?.length; j++) {
                            const button = groups[i].Buttons[j];
                            const programmingType = button.ProgrammingModel?.ProgrammingModelType;

                            const buttonName = ((button.Engraving || {}).Text || button.Name).replace(/\n/g, " ");

                            console.error(
                                `[KEYPAD_INIT] Button: "${buttonName}", Type: ${programmingType || "undefined"}, Index: ${button.ButtonNumber}`,
                            );

                            // Get button-specific config or use default
                            const buttonConfig = this.config.buttonConfig?.[buttonName];
                            const triggerOn = buttonConfig?.triggerOn || "release";

                            // Create TriggerController with configured mode
                            this.setupTriggerButton(button, button.ButtonNumber, {
                                triggerOn,
                                doubleClickSpeed: 500,
                                clickSpeed: 0, // Disable long press timing detection (rely on LongHold from hardware)
                            });
                        }
                    }

                    this.log.info(
                        Colors.green(
                            `KeypadController: Successfully initialized ${this.buttons.length} buttons with TriggerController (default: release mode)`,
                        ),
                    );
                })
                .catch((error: Error) => {
                    this.log.error(
                        Colors.red(
                            `KeypadController: Error fetching buttons for ${device.DeviceType}: ${error.message}`,
                        ),
                    );
                    this.log.error(Colors.red(error.stack || "No stack trace"));
                });
        } else {
            // Non-keypad devices are immediately ready
            this.initPromise = Promise.resolve();
        }
    }

    /**
     * Waits for async initialization to complete.
     * Safe to call multiple times - returns the same promise.
     *
     * @returns A promise that resolves when button loading is complete.
     */
    public initialize(): Promise<void> {
        return this.initPromise || Promise.resolve();
    }

    /**
     * Setup a button with TriggerController to handle Press, DoublePress, and LongPress detection.
     * Uses triggerOn config to determine whether to trigger on 'press', 'release', or 'pressAndRelease'.
     */
    private setupTriggerButton(
        button: ButtonAddress,
        index: number,
        options: Partial<import("@mkellsy/hap-device").TriggerOptions>,
    ): void {
        const trigger = new TriggerController(this.processor, button, index, options);

        this.triggers.push(trigger);
        this.buttons.push(trigger.definition);

        const triggerMode = options.triggerOn || "pressAndRelease";
        console.error(`[TRIGGER_SETUP] Button: "${trigger.definition.name}", ID: ${trigger.definition.id}, Mode: ${triggerMode}, Index: ${index}`);

        // Subscribe to hardware events and feed them to TriggerController
        this.processor
            .subscribe<ButtonStatus>({ href: `${button.href}/status/event` }, (status: ButtonStatus): void => {
                const eventType = status.ButtonEvent.EventType;
                console.error(
                    `[TRIGGER_EVENT] "${button.Name.replace(/\n/g, " ")}" received: ${eventType} (triggerMode: ${triggerMode})`,
                );

                // Feed raw events to TriggerController
                trigger.update(status);
            })
            .catch((error: Error) => this.log.error(Colors.red(error.message)));

        // Listen to TriggerController events and emit as Actions
        trigger.on("Press", (btn: Button) => {
            console.error(`[TRIGGER_ACTION] "${btn.name}" -> Press`);
            this.emit("Action", this, btn, "Press");
        });

        trigger.on("DoublePress", (btn: Button) => {
            console.error(`[TRIGGER_ACTION] "${btn.name}" -> DoublePress`);
            this.emit("Action", this, btn, "DoublePress");
        });

        trigger.on("LongPress", (btn: Button) => {
            console.error(`[TRIGGER_ACTION] "${btn.name}" -> LongPress`);
            this.emit("Action", this, btn, "LongPress");
        });
    }

    /**
     * Recieves a state response from the processor (not supported).
     */
    public update(): void {
        this.initialized = true;
    }

    /**
     * Controls this LEDs on this device.
     *
     * ```js
     * keypad.set({ state: { href: "/led/123456" }, state: "On" });
     * ```
     *
     * @param status Desired device state.
     */
    public set(status: KeypadState): Promise<void> {
        return this.processor.update(status.led, "status", {
            LEDStatus: { State: status.state === "On" ? "On" : "Off" },
        });
    }
}
