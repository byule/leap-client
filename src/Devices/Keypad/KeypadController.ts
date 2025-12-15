import Colors from "colors";

import { Button, DeviceType } from "@mkellsy/hap-device";

import { AreaAddress } from "../../Response/AreaAddress";
import { ButtonAddress } from "../../Response/ButtonAddress";
import { ButtonStatus } from "../../Response/ButtonStatus";
import { Common } from "../Common";
import { DeviceAddress } from "../../Response/DeviceAddress";
import { Keypad } from "./Keypad";
import { KeypadState } from "./KeypadState";
import { Processor } from "../Processor/Processor";

/**
 * Defines a keypad device.
 * @public
 */
export class KeypadController extends Common<KeypadState> implements Keypad {
    public readonly buttons: Button[] = [];

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
            this.log.info(
                Colors.cyan(
                    `KeypadController: Initializing ${device.DeviceType} at ${this.address.href} in HARDWARE mode (raw events)`,
                ),
            );

            this.processor
                .buttons(this.address)
                .then((groups) => {
                    this.log.info(Colors.cyan(`KeypadController: Retrieved ${groups?.length || 0} button groups`));

                    for (let i = 0; i < groups?.length; i++) {
                        for (let j = 0; j < groups[i].Buttons?.length; j++) {
                            const button = groups[i].Buttons[j];
                            const id = `LEAP-${this.processor.id}-BUTTON-${button.href.split("/")[2]}`;
                            const programmingType = button.ProgrammingModel?.ProgrammingModelType;

                            const definition: Button = {
                                id,
                                index: button.ButtonNumber,
                                name: ((button.Engraving || {}).Text || button.Name).replace(/\n/g, " "),
                                led: button.AssociatedLED,
                                supportsLongPress: programmingType === "AdvancedToggleProgrammingModel",
                            } as Button;

                            this.buttons.push(definition);

                            console.error(
                                `[KEYPAD_INIT] Button: "${definition.name}", Type: ${programmingType || "undefined"}, Index: ${button.ButtonNumber}`,
                            );

                            // Hardware mode: Pass through raw events from Lutron
                            this.setupHardwareButton(button, definition);
                        }
                    }

                    this.log.info(
                        Colors.green(
                            `KeypadController: Successfully initialized ${this.buttons.length} buttons in HARDWARE mode`,
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
        }
    }

    /**
     * Setup a button in hardware mode - pass through raw events from Lutron.
     * This is the simplest path with no timing detection or event simulation.
     * Events like Press, Release, LongHold are passed directly to HomeKit.
     */
    private setupHardwareButton(button: ButtonAddress, definition: Button): void {
        console.error(`[HARDWARE_SETUP] Setting up hardware mode for button: ${definition.name}`);

        this.processor
            .subscribe<ButtonStatus>({ href: `${button.href}/status/event` }, (status: ButtonStatus): void => {
                const action = status.ButtonEvent.EventType;
                console.error(`[HARDWARE_EVENT] ${button.Name.replace(/\n/g, " ")} received: ${action}`);

                // Pass through raw events: Press, Release, LongHold, etc.
                // No simulation, no timing detection - just forward what Lutron sends
                // Cast to Action since Lutron sends events that aren't in the Action type (like LongHold)
                this.emit("Action", this, definition, action as any);
            })
            .catch((error: Error) => this.log.error(Colors.red(error.message)));
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
