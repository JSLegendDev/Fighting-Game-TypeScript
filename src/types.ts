export type TiledLayer = {
  id: number;
  name: string;
  type: "tilelayer" | "objectlayer";
  height: number;
  width: number;
  x: number;
  y: number;
  visible: boolean;
  opacity: number;
  data?: number[];
  objects?: Array<TiledObject>;
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
