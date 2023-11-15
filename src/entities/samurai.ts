import { KaboomCtx, Vec2, GameObj } from "kaboom";
import { fighterProps, setFighterControls } from "./fighter";
import { Directions } from "../types";

export function makeSamurai(k: KaboomCtx, parent: GameObj, pos: Vec2) {
  let gameObj = parent.add([
    k.sprite("samurai", { anim: "idle" }),
    k.pos(pos),
    k.area({
      shape: new k.Rect(k.vec2(0), 20, 40),
      collisionIgnore: ["ninja"],
    }),
    k.anchor("center"),
    k.body(),
    k.health(fighterProps.maxHp),
    k.opacity(),
    "samurai",
    {
      ...fighterProps,
    },
  ]);

  gameObj.direction = Directions.RIGHT;

  return {
    gameObj,
    setControls: () =>
      setFighterControls(k, gameObj, {
        LEFT: "a",
        RIGHT: "d",
        UP: "w",
        DOWN: "s",
      }),
  };
}
