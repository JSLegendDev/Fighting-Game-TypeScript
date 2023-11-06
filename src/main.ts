import { GameObj, KaboomCtx } from "kaboom";
import k from "./kaboomCtx";
import { drawTiles, fetchMapData } from "./utils";
import { makeSamurai } from "./entities/samurai";
import { Entity } from "./types";

k.loadSprite(
  "background-layer-1",
  "./assets/background/background_layer_1.png"
);

k.loadSprite(
  "background-layer-2",
  "./assets/background/background_layer_2.png"
);

k.loadSprite("tileset", "./assets/oak_woods_tileset.png", {
  sliceX: 31,
  sliceY: 22,
});

k.loadSprite("idle-samurai", "./assets/entities/idle-player1.png", {
  sliceX: 8,
  sliceY: 1,
  anims: {
    idle: {
      from: 0,
      to: 7,
      loop: true,
    },
  },
});

async function arena(k: KaboomCtx) {
  k.setGravity(800);

  k.add([k.sprite("background-layer-1"), k.pos(0, 0), k.scale(4), k.fixed()]);
  k.add([k.sprite("background-layer-2"), k.pos(0, 0), k.scale(4), k.fixed()]);

  const { layers, tilewidth, tileheight } = await fetchMapData(
    "./maps/arena.json"
  );

  const map = k.add([k.pos(0, 0)]);

  const entities: { player1: Entity | null; player2: GameObj | null } = {
    player1: null,
    player2: null,
  };

  for (const layer of layers) {
    if (layer.name === "Boundaries") {
      for (const object of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), object.width, object.height),
          }),
          k.pos(object.x, object.y + tileheight),
          k.body({ isStatic: true }),
        ]);
      }
    }

    if (layer.name === "SpawnPoints") {
      for (const object of layer.objects) {
        if (object.name === "player-1") {
          entities.player1 = makeSamurai(k, map, k.vec2(object.x, object.y));
          continue;
        }

        if (object.name === "player-2") {
          entities.player2 = map.add([
            k.rect(16, 32),
            k.area(),
            k.outline(3),
            k.pos(object.x, object.y),
            k.body(),
          ]);
          continue;
        }
      }

      continue;
    }

    drawTiles(k, map, layer, tilewidth, tileheight);
  }

  map.use(k.scale(1));

  k.camPos(k.vec2(k.center().x - 480, k.center().y - 170));
  k.camScale(k.vec2(4));
}

k.scene("arena", () => arena(k));

k.go("arena");
