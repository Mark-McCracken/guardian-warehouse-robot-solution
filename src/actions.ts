import { AdvancedDirection, BasicDirection } from "./direction.enum";

export enum CrateAction {
    Grab = "G",
    Drop = "D"
}

export const allCrateActions: string[] = [CrateAction.Grab, CrateAction.Drop];

export type InputActions = CrateAction | BasicDirection;

export type InternalActions = InputActions | AdvancedDirection;
