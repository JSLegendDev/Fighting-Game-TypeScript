import { GameObj } from "kaboom";

type TiledBaseLayer = {
  id: number;
  name: string;
  height: number;
  width: number;
  x: number;
  y: number;
  visible: boolean;
  opacity: number;
};

export type TiledTileLayer = TiledBaseLayer & {
  type: "tilelayer";
  data: number[];
  objects: never;
};

export type TiledObjectLayer = TiledBaseLayer & {
  type: "objectgroup";
  data: never;
  objects: Array<TiledObject>;
};

export type TiledLayer = TiledTileLayer | TiledObjectLayer;

export type TiledObject = {
  height: number;
  id: number;
  name: string;
  point: boolean;
  rotation: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
};

export type Entity = {
  gameObj: GameObj;
  setControls: () => void;
};

export enum Directions {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
