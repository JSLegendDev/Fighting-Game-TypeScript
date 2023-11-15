import { KaboomCtx, Vec2, GameObj } from "kaboom";
import { fighterProps, setFighterControls } from "./fighter";
import { Directions } from "../types";

export function makeNinja(k: KaboomCtx, parent: GameObj, pos: Vec2) {
  let gameObj = parent.add([
    k.sprite("ninja", { anim: "idle" }),
    k.pos(pos),
    k.area({
      shape: new k.Rect(k.vec2(0, 6), 20, 40),
      collisionIgnore: ["samurai"],
    }),
    k.anchor("center"),
    k.body(),
    k.health(fighterProps.maxHp),
    k.opacity(),
    "ninja",
    {
      ...fighterProps,
    },
  ]);

  gameObj.flipX = true;
  gameObj.direction = Directions.LEFT;

  return {
    gameObj,
    setControls: () =>
      setFighterControls(k, gameObj, {
        LEFT: "left",
        RIGHT: "right",
        UP: "up",
        DOWN: "down",
      }),
  };
}
