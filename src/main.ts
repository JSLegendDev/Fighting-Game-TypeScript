import { KaboomCtx } from "kaboom";
import k from "./kaboomCtx";
import { drawTiles, fetchMapData } from "./utils";
import { makeSamurai } from "./entities/samurai";
import { TiledLayer, Entity } from "./types";
import { makeNinja } from "./entities/ninja";

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

k.loadSprite("samurai", "./assets/entities/samurai.png", {
  sliceX: 8,
  sliceY: 9,
  anims: {
    idle: {
      from: 32,
      to: 39,
      loop: true,
    },
    run: {
      from: 48,
      to: 55,
      loop: true,
    },
    attack: {
      from: 0,
      to: 5,
      speed: 16,
    },
  },
});

k.loadSprite("ninja", "./assets/entities/ninja.png", {
  sliceX: 8,
  sliceY: 8,
  anims: {
    idle: {
      from: 32,
      to: 35,
      loop: true,
    },
    run: {
      from: 48,
      to: 55,
      loop: true,
    },
    attack: {
      from: 0,
      to: 3,
    },
  },
});

k.loadSprite("shop", "./assets/shop_anim.png", {
  sliceX: 6,
  sliceY: 1,
  anims: {
    default: {
      from: 0,
      to: 5,
      loop: true,
    },
  },
});

k.loadSprite("fence-1", "./assets/fence_1.png");
k.loadSprite("fence-2", "./assets/fence_2.png");

async function arena(k: KaboomCtx) {
  k.setGravity(2000);

  k.add([k.sprite("background-layer-1"), k.pos(0, 0), k.scale(4), k.fixed()]);
  k.add([k.sprite("background-layer-2"), k.pos(0, 0), k.scale(4), k.fixed()]);

  const { layers, tilewidth, tileheight } = await fetchMapData(
    "./maps/arena.json"
  );

  const map = k.add([k.pos(0, 0)]);

  const entities: { player1: Entity | null; player2: Entity | null } = {
    player1: null,
    player2: null,
  };

  let layer: TiledLayer;
  for (layer of layers) {
    if (layer.name === "Boundaries" && layer.type === "objectgroup") {
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

    if (
      layer.name === "DecorationSpawnPoints" &&
      layer.type === "objectgroup"
    ) {
      for (const object of layer.objects) {
        switch (object.name) {
          case "shop":
            map.add([
              k.sprite("shop", { anim: "default" }),
              k.pos(object.x, object.y),
              k.area(),
              k.anchor("center"),
            ]);
            break;
          case "fence-1":
            map.add([
              k.sprite("fence-1"),
              k.pos(object.x, object.y + 6),
              k.area(),
              k.anchor("center"),
            ]);
            break;
          default:
        }
      }

      continue;
    }

    if (layer.name === "SpawnPoints" && layer.type === "objectgroup") {
      for (const object of layer.objects) {
        switch (object.name) {
          case "player-1":
            entities.player1 = makeSamurai(k, map, k.vec2(object.x, object.y));
            break;
          case "player-2":
            entities.player2 = makeNinja(k, map, k.vec2(object.x, object.y));
            break;
          default:
        }
      }

      continue;
    }

    if (layer.type === "tilelayer") {
      drawTiles(k, map, layer, tilewidth, tileheight);
    }
  }

  k.camPos(k.vec2(k.center().x - 450, k.center().y - 160));
  k.camScale(k.vec2(4));

  entities.player1?.setControls();
  entities.player2?.setControls();
}

k.scene("arena", () => arena(k));

k.go("arena");
