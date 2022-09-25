import { Position } from "./position";
import { v4 as uuidv4 } from 'uuid';

export class Warehouse {
    cratePositions: Set<string> = new Set();
    totalColumns: number;
    totalRows: number;
    get totalCrates(): number {
        return this.cratePositions.size;
    }
    id = uuidv4();

    constructor(currentCrates: Set<string> = new Set(),
                totalColumns: number = 10,
                totalRows: number = 10) { // default is empty 10/10 warehouse
        this.cratePositions = currentCrates;
        const allXPositions = Array.from(this.cratePositions).map(i => parseInt(i.split(",")[0]));
        if (allXPositions.some(x => x >= totalColumns)) throw new Error(`Warehouse id ${this.id} found an item outside the bounds of the warehouse in the x axis (east/west)`);
        const allYPositions = Array.from(this.cratePositions).map(i => parseInt(i.split(",")[1]));
        if (allYPositions.some(y => y >= totalRows)) throw new Error(`Warehouse id ${this.id} found an item outside the bounds of the warehouse in the y axis (north/south)`);
        this.totalColumns = totalColumns;
        this.totalRows = totalRows;
    }

    grabCrate(position: Position) {
        if (!this.cratePositions.has(`${position}`)) throw new Error(`Warehouse id ${this.id} expected to pick up a crate at ${position}, but there isn't a crate there!`);
        this.cratePositions.delete(`${position}`);
    }

    dropCrate(position: Position) {
        if (this.cratePositions.has(`${position}`)) throw new Error(`Warehouse id ${this.id} expected to set down a crate at ${position}, but there is already a crate there!`);
        this.cratePositions.add(`${position}`);
    }
}
