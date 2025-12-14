import { Address } from "./Address";
/**
 * An area status.
 * @private
 */
export type AreaStatus = Address & {
    /**
     * Brightness level.
     */
    Level: number;
    /**
     * Occupancy status.
     */
    OccupancyStatus: string;
    /**
     * Area's current scene.
     */
    CurrentScene: Address;
};
//# sourceMappingURL=AreaStatus.d.ts.map