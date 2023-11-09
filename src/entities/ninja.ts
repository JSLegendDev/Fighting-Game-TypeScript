import { KaboomCtx, Vec2, GameObj } from "kaboom";
import { setFighterControls } from "./fighter";

export function makeNinja(k: KaboomCtx, parent: GameObj, pos: Vec2) {
  let gameObj = parent.add([
    k.sprite("ninja", { anim: "idle" }),
    k.pos(pos),
    k.area({ shape: new k.Rect(k.vec2(0, 6), 20, 40) }),
    k.anchor("center"),
    k.body(),
    {
      speed: 200,
    },
  ]);

  gameObj.flipX = true;

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
