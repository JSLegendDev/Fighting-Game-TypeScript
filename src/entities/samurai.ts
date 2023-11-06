import { KaboomCtx, Vec2, GameObj } from "kaboom";

export function makeSamurai(k: KaboomCtx, parent: GameObj, pos: Vec2) {
  let gameObj = parent.add([
    k.sprite("idle-samurai", { anim: "idle" }),
    k.pos(pos),
    k.area({ shape: new k.Rect(k.vec2(0), 20, 40) }),
    k.anchor("center"),
    k.body(),
    {
      speed: 200,
    },
  ]);

  return {
    gameObj,
    setControls() {
      k.onKeyDown((key) => {
        switch (key) {
          case "a":
            gameObj.flipX = true;
            gameObj.move(-gameObj.speed, 0);
            break;
          case "d":
            gameObj.flipX = false;
            gameObj.move(gameObj.speed, 0);
            break;
          default:
        }
      });

      k.onKeyPress("w", () => {
        if (gameObj.isGrounded()) gameObj.jump();
      });
    },
  };
}
