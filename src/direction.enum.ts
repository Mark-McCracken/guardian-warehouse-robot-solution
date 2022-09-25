export enum BasicDirection {
    North = "N",
    South = "S",
    East = "E",
    West = "W"
}

export enum AdvancedDirection {
    NorthEast = "NE",
    NorthWest = "NW",
    SouthEast = "SE",
    SouthWest = "SW"
}

export type Direction = BasicDirection | AdvancedDirection;

export const latitudinalMoves: string[] = [BasicDirection.North, BasicDirection.South];
export const longitudinalMoves: string[] = [BasicDirection.East, BasicDirection.West];

export const basicDirections: string[] = [...latitudinalMoves, ...longitudinalMoves];

export const anyDirection = [...basicDirections,
    AdvancedDirection.NorthEast,
    AdvancedDirection.NorthWest,
    AdvancedDirection.SouthEast,
    AdvancedDirection.SouthWest
];
