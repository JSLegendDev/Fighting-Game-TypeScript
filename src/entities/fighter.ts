import { GameObj, KaboomCtx, Vec2 } from "kaboom";

export const fighterProps = {
  speed: 200,
  direction: null,
  isSwordAnimPlaying: false,
};

export function setFighterControls(
  k: KaboomCtx,
  fighter: GameObj,
  keys: { LEFT: string; RIGHT: string; UP: string; DOWN: string }
) {
  k.onKeyDown((key) => {
    if (fighter.isSwordAnimPlaying) return;

    switch (key) {
      case keys.LEFT:
        fighter.flipX = true;
        fighter.move(-fighter.speed, 0);
        if (fighter.curAnim() !== "run") fighter.play("run");
        fighter.direction = "LEFT";
        break;
      case keys.RIGHT:
        fighter.flipX = false;
        fighter.move(fighter.speed, 0);
        if (fighter.curAnim() !== "run") fighter.play("run");
        fighter.direction = "RIGHT";
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
          const fighterPos = fighter.worldPos();
          const hitboxPos: { [key: string]: Vec2 } = {
            LEFT: k.vec2(fighterPos.x - 50, fighterPos.y),
            RIGHT: k.vec2(fighterPos.x, fighterPos.y),
          };

          const attackHitbox = k.add([
            k.area({ shape: new k.Rect(k.vec2(0), 50, 50) }),
            k.pos(hitboxPos[fighter.direction]),
          ]);

          fighter.play("attack", {
            onEnd() {
              fighter.play("idle");
              k.destroy(attackHitbox);
              fighter.isSwordAnimPlaying = false;
            },
          });
          fighter.isSwordAnimPlaying = true;
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
