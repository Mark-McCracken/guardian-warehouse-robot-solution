import { Warehouse } from "./warehouse";

export class Position {
    x: number;
    y: number;
    warehouse: Warehouse;

    get canMoveNorth(): boolean { return this.y < this.warehouse.totalRows - 1; } // totalRows would be one-indexed, whereas y would be zero-indexed;
    get canMoveSouth(): boolean { return this.y > 0; }
    get canMoveEast(): boolean { return this.x < this.warehouse.totalColumns - 1; }
    get canMoveWest(): boolean { return this.x > 0; }
    get canMoveNorthEast(): boolean { return this.canMoveNorth && this.canMoveEast }
    get canMoveNorthWest(): boolean { return this.canMoveNorth && this.canMoveWest }
    get canMoveSouthEast(): boolean { return this.canMoveSouth && this.canMoveEast }
    get canMoveSouthWest(): boolean { return this.canMoveSouth && this.canMoveWest }

    toString(): string {
        return `${this.x},${this.y}`
    }

    constructor(position: {x: number, y:number} = {x:0, y:0},
                warehouse: Warehouse = new Warehouse()) {
        this.warehouse = warehouse;
        if (position.x < 0) throw new Error(`Can't have a x position less than 0`);
        if (position.y < 0) throw new Error(`Can't have a y position less than 0`);
        if (position.x >= warehouse.totalColumns) throw new Error(`Warehouse id ${warehouse.id} can't have an x position of ${position.x}, as there are only ${warehouse.totalColumns} columns`);
        if (position.y >= warehouse.totalRows) throw new Error(`Warehouse id ${warehouse.id} can't have a y position of ${position.y}, as there are only ${warehouse.totalRows} rows`);
        this.x = position.x;
        this.y = position.y;
    }

    get hasCrate(): boolean {
        return this.warehouse.cratePositions.has(this.toString());
    }
    
}
