import { Position } from "./position";
import { Warehouse } from "./warehouse";

describe("Warehouse", () => {
    it("should create an empty default size warehouse", () => {
        const wh = new Warehouse();
        expect(wh.cratePositions.size).toBe(0);
        expect(wh.id).toBeTruthy();
        expect(wh.totalColumns).toBe(10);
        expect(wh.totalRows).toBe(10);
    });
    it("should not be created with crate positions outside the bounds", () => {
        const cratePositions: Set<string> = new Set(["14,1"]);
        expect(_ => new Warehouse(cratePositions)).toThrowError();
        expect(_ => new Warehouse(cratePositions, 15)).not.toThrow();
    });
    it("should be able to pick up a crate which exists", () => {
        const cratePositions: Set<string> = new Set(["2,1"]);
        const wh = new Warehouse(cratePositions);
        expect(wh.totalCrates).toBe(1);
        const position = new Position({x:2, y:1}, wh);
        expect(position.hasCrate).toBeTruthy();
        expect(() => wh.grabCrate(position)).not.toThrowError();
        expect(position.hasCrate).toBeFalsy();
        expect(wh.totalCrates).toBe(0);
    });
    it("should not be able to pick up a non-existent crate", () => {
        const wh = new Warehouse();
        const position = new Position({x:1, y:2}, wh);
        expect(wh.totalCrates).toBe(0);
        expect(position.hasCrate).toBeFalsy();
        expect(() => wh.grabCrate(position)).toThrowError();
    });
    it("should not allow two crates to land in the same position", () => {
        const wh = new Warehouse();
        const position = new Position({x:1, y:2}, wh);
        expect(wh.totalCrates).toBe(0);
        expect(position.hasCrate).toBeFalsy();
        expect(() => position.warehouse.dropCrate(position)).not.toThrow();
        expect(wh.totalCrates).toBe(1);
        expect(position.hasCrate).toBeTruthy();
        expect(() => position.warehouse.dropCrate(position)).toThrow();
        expect(wh.totalCrates).toBe(1);
        expect(position.hasCrate).toBeTruthy();
    });
});
