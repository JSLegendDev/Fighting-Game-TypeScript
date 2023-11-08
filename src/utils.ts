import { KaboomCtx, GameObj } from "kaboom";
import { TiledTileLayer } from "./types";

export async function fetchMapData(mapFilePath: string) {
  const response = await fetch(mapFilePath);
  if (response.status === 404) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export function drawTiles(
  k: KaboomCtx,
  map: GameObj,
  layer: TiledTileLayer,
  tilewidth: number,
  tileheight: number
) {
  let nbOfDrawnTiles = 0;
  const tilePos = k.vec2(0, 0);
  for (const tile of layer.data) {
    if (nbOfDrawnTiles % layer.width === 0) {
      tilePos.x = 0;
      tilePos.y += tileheight;
    } else {
      tilePos.x += tilewidth;
    }

    nbOfDrawnTiles++;

    if (tile === 0) continue;

    map.add([
      k.sprite("tileset", { frame: tile - 1 }),
      k.pos(tilePos),
      k.offscreen(),
    ]);
  }
}
