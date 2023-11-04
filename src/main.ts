import { KaboomCtx } from "kaboom";
import k from "./kaboomCtx";

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

function arena(k: KaboomCtx) {
  k.add([k.sprite("background-layer-1"), k.pos(0, 0), k.scale(4), k.fixed()]);
  k.add([k.sprite("background-layer-2"), k.pos(0, 0), k.scale(4), k.fixed()]);
}

k.scene("arena", () => arena(k));

k.go("arena");
