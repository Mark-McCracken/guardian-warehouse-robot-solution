import { InputActions, InternalActions } from "./actions";
import { AdvancedDirection, BasicDirection, basicDirections } from "./direction.enum";
import { Position } from "./position";
import { Robot } from "./robot";
import { Warehouse } from "./warehouse";

describe("basic robot movement", () => {
    it("moves in each direction successfully", () => {
        const startX = 1;
        const startY = 3;
        const warehouse = new Warehouse();
        const position = new Position({x: startX, y: startY}, warehouse);
        const myRobot = new Robot(warehouse, position);
        myRobot.move(BasicDirection.North);
        expect(myRobot.position.y).toBe(startY+1);
        myRobot.move(BasicDirection.East);
        expect(myRobot.position.x).toBe(startX+1);
        myRobot.move(BasicDirection.South);
        expect(myRobot.position.y).toBe(startY);
        myRobot.move(BasicDirection.West);
        expect(myRobot.position.x).toBe(startX);
    });
    it("should not move outside the bounds of the warehouse", () => {
        const myRobot = new Robot();
        expect(myRobot.position.x).toBe(0);
        expect(myRobot.position.y).toBe(0);
        expect(_ => myRobot.move(BasicDirection.South)).toThrowError();
        expect(myRobot.position.y).toBe(0);
        expect(_ => myRobot.move(BasicDirection.West)).toThrowError();
        expect(myRobot.position.x).toBe(0);
    });
    it("should correctly analyse a shortcut, reducing steps taken", () => {
        const myRobot = new Robot();
        const validSteps: InputActions[] = [BasicDirection.North, BasicDirection.East, BasicDirection.South];
        const expectedShortcut: InternalActions[] = [AdvancedDirection.NorthEast, BasicDirection.South];
        expect(myRobot.shortcutSteps(validSteps).toString()).toEqual(expectedShortcut.toString());
        myRobot.actionSequence(validSteps.join(" "));
        expect(myRobot.movesMade).toEqual(2);

        const validSteps2: InputActions[] = [BasicDirection.North, BasicDirection.East, BasicDirection.South, BasicDirection.East, BasicDirection.North, BasicDirection.West];
        const expectedShortcut2: InternalActions[] = [AdvancedDirection.NorthEast, AdvancedDirection.SouthEast, AdvancedDirection.NorthWest];
        expect(myRobot.shortcutSteps(validSteps2).toString()).toEqual(expectedShortcut2.toString());

        myRobot.actionSequence(validSteps2.join(" "));
        expect(myRobot.movesMade).toEqual(5);
    })
});
  
describe("sequencing movements", () => {
    it("should make multiple moves", () => {
        const myRobot = new Robot();
        myRobot.actionSequence("N E N E N E N E");
        expect(myRobot.position.x).toBe(4);
        expect(myRobot.position.y).toBe(4);
    });
    it("should not go outside multiple moves", () => {
        const myRobot = new Robot();
        expect(() => myRobot.actionSequence("N E S S")).toThrowError();
        expect(myRobot.position.x).toBe(1);
        expect(myRobot.position.y).toBe(0);
    });
    it("should ignore nonsense commands", () => {
        const myRobot = new Robot();
        expect(() => myRobot.filterOnlyValidSteps("N A B C E").toString()).toThrowError();
    });
});
  
describe("crateMovement", () => {
    it("should pickup a crate and move it", () => {
        const cratePositions = new Set(["4,4"]); // starts in middle, will move to 1,1 and go home
        const wh = new Warehouse(cratePositions);
        const myRobot = new Robot(wh);
        myRobot.actionSequence("N E N E N E N E G S W S W S W D S W");
        expect(myRobot.position.toString()).toBe("0,0");
        expect(wh.cratePositions.has("1,1")).toBeTruthy();
    });
    it("should not pick up a crate when already holding a crate", () => {
        const cratePositions = new Set(["1,1", "2,2"]);
        const wh = new Warehouse(cratePositions);
        const myRobot = new Robot(wh);
        expect(myRobot.isHoldingACrate).toBeFalsy();
        myRobot.actionSequence("N E G N E");
        expect(myRobot.isHoldingACrate).toBeTruthy();
        expect(() => myRobot.actionSequence("G")).toThrowError();
    });
    it("should not try to lift a crate if there is not one present", () => {
        const cratePositions = new Set(["1,1", "2,2"]);
        const wh = new Warehouse(cratePositions);
        const myRobot = new Robot(wh);
        myRobot.actionSequence("N");
        expect(() => myRobot.actionSequence("G")).toThrowError();
    });
    it("should not drop a crate on top of another crate", () => {
        const cratePositions = new Set(["1,1", "2,2"]);
        const wh = new Warehouse(cratePositions);
        const myRobot = new Robot(wh);
        expect(myRobot.isHoldingACrate).toBeFalsy();
        myRobot.actionSequence("N E G N E");
        expect(() => myRobot.actionSequence("D")).toThrowError();
    });
});
