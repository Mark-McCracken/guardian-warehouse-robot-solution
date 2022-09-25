import { Direction, AdvancedDirection, anyDirection, basicDirections, BasicDirection, latitudinalMoves, longitudinalMoves } from "./direction.enum";
import { Position } from "./position";
import { Warehouse } from "./warehouse";
import { v4 as uuidv4 } from "uuid";
import { allCrateActions, CrateAction, InputActions, InternalActions } from "./actions";

export class Robot {
    id = uuidv4();
    position: Position;
    movesMade = 0;
    isHoldingACrate: boolean = false;
    warehouse: Warehouse;

    constructor(warehouse: Warehouse = new Warehouse(),
                position: Position = new Position({x: 0, y: 0}, warehouse)) {
        this.position = position;
        this.warehouse = warehouse;
    }

    move(direction: Direction) {
        const errMessage = `Requested to move in ${direction} direction, but can't move ${direction} any further.`;
        switch (direction) {
            case BasicDirection.North:
                if (!this.position.canMoveNorth) throw new Error(errMessage);
                this.position.y += 1;
                break;
            case BasicDirection.South:
                if (!this.position.canMoveSouth) throw new Error(errMessage);
                this.position.y -= 1;
                break;
            case BasicDirection.East:
                if (this.position.x >= 9) throw new Error(errMessage);
                this.position.x += 1;
                break;
            case BasicDirection.West:
                if (this.position.x <= 0) throw new Error(errMessage);
                this.position.x -= 1;
                break;
            case AdvancedDirection.NorthEast:
                if (!this.position.canMoveNorthEast) throw new Error(errMessage);
                this.position.x += 1;
                this.position.y += 1;
                break;
            case AdvancedDirection.NorthWest:
                if (!this.position.canMoveNorthWest) throw new Error(errMessage);
                this.position.x -= 1;
                this.position.y += 1;
                break;
            case AdvancedDirection.SouthEast:
                if (!this.position.canMoveSouthEast) throw new Error(errMessage);
                this.position.x += 1;
                this.position.y -= 1;
                break;
            case AdvancedDirection.SouthWest:
                if (!this.position.canMoveSouthWest) throw new Error(errMessage);
                this.position.x -= 1;
                this.position.y -= 1;
                break;
        }
        this.movesMade++;
    }

    grab() {
        if (this.isHoldingACrate) throw new Error(`Robot id ${this.id} can't pick up a create, already holding a crate!`);
        this.warehouse.grabCrate(this.position);
        this.isHoldingACrate = true;
    }

    drop() {
        if (!this.isHoldingACrate) throw new Error(`Robot id ${this.id} can't set down a crate, not holding a crate!`);
        this.warehouse.dropCrate(this.position);
        this.isHoldingACrate = false;
    }

    actionSequence(commands: string) {
        console.log(`Robot id ${this.id} in warehouse ${this.warehouse.id} is in position x: ${this.position.x}, y: ${this.position.y}, and received these commands: ${commands}`);
        const validSteps = this.filterOnlyValidSteps(commands);
        const shortCutSteps = this.shortcutSteps(validSteps);
        for (let step of shortCutSteps) {
            if (anyDirection.includes(step)) this.move(step as Direction);
            if (step == CrateAction.Grab) this.grab();
            if (step == CrateAction.Drop) this.drop();
        }
        console.log(`Robot id ${this.id} has new location (x: ${this.position.x}, y: ${this.position.y}), after moving ${this.movesMade} times`);
    }

    shortcutSteps(validSteps: InputActions[]): InternalActions[] {
        // analyse steps, work out if any pairs of steps can be diagonal
        const newSteps: InternalActions[] = [];
        if (validSteps.length <= 1) return validSteps;
        for (let i = 0; i < validSteps.length -1; i++) {
            if (latitudinalMoves.includes(validSteps[i]) && longitudinalMoves.includes(validSteps[i+1])) {
                newSteps.push(validSteps[i] + validSteps[i+1] as AdvancedDirection);
                i++;
            } else if (longitudinalMoves.includes(validSteps[i]) && latitudinalMoves.includes(validSteps[i+1])) {
                newSteps.push(validSteps[i+1] + validSteps[i] as AdvancedDirection);
                i++;
            } else {
                newSteps.push(validSteps[i]);
            }
            if (i == validSteps.length - 2) {
                newSteps.push(validSteps[i+1]);
                break;
            }
        }
        return newSteps;
    }

    filterOnlyValidSteps(commands: string): InputActions[] {
        const steps: string[] = commands.split(" ");
        const validSteps: InputActions[] = steps.filter((i) => {
            const isADirection = basicDirections.includes(i);
            const isAnAction = allCrateActions.includes(i);
            if (isADirection || isAnAction) return true;
            throw new Error(`Got a value in the sequence of commands that does not adhere to a valid direction, nor action.
            Got: ${i}.
            Expected one of : ${basicDirections.toString()}, or ${allCrateActions.toString()}
            `);
        }) as InputActions[];
        return validSteps;
    }

}
