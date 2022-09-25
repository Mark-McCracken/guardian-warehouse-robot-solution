import { Position } from "./position";
import { Warehouse } from "./warehouse";

describe("position", () => {
    it("should not be allowed to created if outside the bounds of the warehouse", () => {
        const wh = new Warehouse();
        expect(_ => new Position({x:10, y: 9}, wh)).toThrowError();
        expect(_ => new Position({x:9, y: 10}, wh)).toThrowError();
        expect(_ => new Position({x:9, y: 9}, wh)).not.toThrowError();
        expect(_ => new Position({x:-1, y: 9}, wh)).toThrowError();
    });
    it("should know if it is above a crate", () => {
        const wh = new Warehouse(new Set(["1,1"]));
        const position = new Position({x: 1, y: 1}, wh);
        expect(position.hasCrate).toBeTruthy();
        position.x = position.x + 1;
        expect(position.hasCrate).toBeFalsy();
    });
    it("should describe it's own position using toString", () => {
        const position = new Position({x: 2, y: 3});
        expect(`${position}`).toEqual(`2,3`);
    });
    it("should know if it can't move outside the warehouse", () => {
        const position = new Position();
        // clockwise...
        expect(position.canMoveNorth).toBeTruthy();
        expect(position.canMoveNorthEast).toBeTruthy();
        expect(position.canMoveEast).toBeTruthy();
        expect(position.canMoveSouthEast).toBeFalsy();
        expect(position.canMoveSouth).toBeFalsy();
        expect(position.canMoveSouthWest).toBeFalsy();
        expect(position.canMoveWest).toBeFalsy();
        expect(position.canMoveNorthWest).toBeFalsy();
        position.x = 9;
        position.y = 9;
        // clockwise...
        expect(position.canMoveNorth).toBeFalsy();
        expect(position.canMoveNorthEast).toBeFalsy();
        expect(position.canMoveEast).toBeFalsy();
        expect(position.canMoveSouthEast).toBeFalsy();
        expect(position.canMoveSouth).toBeTruthy();
        expect(position.canMoveSouthWest).toBeTruthy();
        expect(position.canMoveWest).toBeTruthy();
        expect(position.canMoveNorthWest).toBeFalsy();
    });
});
