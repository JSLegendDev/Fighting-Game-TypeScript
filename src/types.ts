import { GameObj } from "kaboom";

type TiledBasicLayer = {
  id: number;
  name: string;
  height: number;
  width: number;
  x: number;
  y: number;
  visible: boolean;
  opacity: number;
};

export type TiledTileLayer = TiledBasicLayer & {
  type: "tilelayer";
  data: number[];
};

export type TiledObjectLayer = TiledBasicLayer & {
  type: "objectlayer";
  objects: Array<TiledObject>;
};

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
  setControls: Function;
};
