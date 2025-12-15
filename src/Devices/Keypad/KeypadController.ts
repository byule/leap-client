import Colors from "colors";

import { Button, DeviceType } from "@mkellsy/hap-device";

import { AreaAddress } from "../../Response/AreaAddress";
import { ButtonStatus } from "../../Response/ButtonStatus";
import { Common } from "../Common";
import { DeviceAddress } from "../../Response/DeviceAddress";
import { Keypad } from "./Keypad";
import { KeypadState } from "./KeypadState";
import { Processor } from "../Processor/Processor";
import { Trigger } from "../Remote/Trigger";
import { TriggerController } from "../Remote/TriggerController";

/**
 * Defines a keypad device.
 * @public
 */
export class KeypadController extends Common<KeypadState> implements Keypad {
    public readonly buttons: Button[] = [];

    private triggers: Map<string, Trigger> = new Map();

    /**
     * Creates a keypad device.
     *
     * ```js
     * const keypad = new Keypad(processor, area, device);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param device A refrence to this device.
     */
    constructor(processor: Processor, area: AreaAddress, device: DeviceAddress) {
        super(DeviceType.Keypad, processor, area, device, {
            led: { href: "/unknown" },
            state: "Off",
        });

        if (
            device.DeviceType === "SunnataKeypad" ||
            device.DeviceType === "SunnataHybridKeypad" ||
            device.DeviceType === "PalladiomKeypad"
        ) {
            this.processor
                .buttons(this.address)
                .then((groups) => {
                    for (let i = 0; i < groups?.length; i++) {
                        for (let j = 0; j < groups[i].Buttons?.length; j++) {
                            const button = groups[i].Buttons[j];
                            const id = `LEAP-${this.processor.id}-BUTTON-${button.href.split("/")[2]}`;
                            const programmingType = button.ProgrammingModel?.ProgrammingModelType;

                            const definition: Button = {
                                id,
                                index: button.ButtonNumber,
                                name: (button.Engraving || {}).Text || button.Name,
                                led: button.AssociatedLED,
                                supportsLongPress: programmingType === "AdvancedToggleProgrammingModel",
                            } as Button;

                            this.buttons.push(definition);

                            // Check if button supports Press+Release (AdvancedToggle) or Press-only (SingleAction)
                            if (programmingType === "AdvancedToggleProgrammingModel") {
                                // Use TriggerController for full Press/Release/DoublePress/LongPress support
                                const trigger = new TriggerController(this.processor, button, button.ButtonNumber, {
                                    raiseLower: false,
                                });

                                trigger.on("Press", (button): void => {
                                    this.log.info(Colors.yellow(`Emitting Action: ${definition.name} - Press`));
                                    this.emit("Action", this, definition, "Press");
                                    setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                                });

                                trigger.on("DoublePress", (button): void => {
                                    this.emit("Action", this, definition, "DoublePress");
                                    setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                                });

                                trigger.on("LongPress", (button): void => {
                                    this.emit("Action", this, definition, "LongPress");
                                    setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                                });

                                this.triggers.set(button.href, trigger);

                                this.processor
                                    .subscribe<ButtonStatus>(
                                        { href: `${button.href}/status/event` },
                                        (status: ButtonStatus): void => {
                                            this.log.info(
                                                Colors.green(
                                                    `Keypad button event: ${button.Name} - ${status.ButtonEvent.EventType}`,
                                                ),
                                            );
                                            this.triggers.get(button.href)!.update(status);
                                        },
                                    )
                                    .catch((error: Error) => this.log.error(Colors.red(error.message)));
                            } else {
                                // Press-only button (SingleAction) - support single and double press
                                let lastPressTime = 0;
                                let pressTimeout: NodeJS.Timeout | null = null;

                                this.processor
                                    .subscribe<ButtonStatus>(
                                        { href: `${button.href}/status/event` },
                                        (status: ButtonStatus): void => {
                                            const action = status.ButtonEvent.EventType;
                                            this.log.info(
                                                Colors.green(
                                                    `Keypad button event (SingleAction): ${button.Name} - ${action}`,
                                                ),
                                            );

                                            if (action !== "Press") return;

                                            const now = Date.now();
                                            const timeSinceLastPress = now - lastPressTime;

                                            // Clear any pending single press
                                            if (pressTimeout) {
                                                clearTimeout(pressTimeout);
                                                pressTimeout = null;
                                            }

                                            // Double press detected (within 500ms)
                                            if (timeSinceLastPress < 500 && lastPressTime > 0) {
                                                this.log.info(
                                                    Colors.yellow(
                                                        `Emitting Action (SingleAction): ${definition.name} - DoublePress`,
                                                    ),
                                                );
                                                this.emit("Action", this, definition, "DoublePress");
                                                setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                                                lastPressTime = 0; // Reset
                                            } else {
                                                // Potential single press - wait to see if another press comes
                                                lastPressTime = now;
                                                pressTimeout = setTimeout(() => {
                                                    this.log.info(
                                                        Colors.yellow(
                                                            `Emitting Action (SingleAction): ${definition.name} - Press`,
                                                        ),
                                                    );
                                                    this.emit("Action", this, definition, "Press");
                                                    setTimeout(
                                                        () => this.emit("Action", this, definition, "Release"),
                                                        100,
                                                    );
                                                    pressTimeout = null;
                                                }, 500);
                                            }
                                        },
                                    )
                                    .catch((error: Error) => this.log.error(Colors.red(error.message)));
                            }
                        }
                    }
                })
                .catch((error: Error) => this.log.error(Colors.red(error.message)));
        }
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
