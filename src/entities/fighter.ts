import { GameObj, KaboomCtx } from "kaboom";

export function setFighterControls(
  k: KaboomCtx,
  fighter: GameObj,
  keys: { LEFT: string; RIGHT: string; UP: string; DOWN: string }
) {
  k.onKeyDown((key) => {
    switch (key) {
      case keys.LEFT:
        fighter.flipX = true;
        fighter.move(-fighter.speed, 0);
        if (fighter.curAnim() !== "run") fighter.play("run");
        break;
      case keys.RIGHT:
        fighter.flipX = false;
        fighter.move(fighter.speed, 0);
        if (fighter.curAnim() !== "run") fighter.play("run");
        break;
      default:
    }
  });

  k.onKeyPress((key) => {
    switch (key) {
      case keys.UP:
        if (fighter.isGrounded()) fighter.jump();
        break;
      case keys.DOWN:
        if (fighter.curAnim() !== "attack") {
          fighter.play("attack", {
            onEnd() {
              fighter.play("idle");
            },
          });
        }
        break;
      default:
    }
  });

  k.onKeyRelease(() => {
    if (fighter.curAnim() !== "idle" && fighter.curAnim() !== "attack")
      fighter.play("idle");
  });
}
