import { GameObj, KaboomCtx, Vec2 } from "kaboom";

export const fighterProps: {
  speed: number;
  direction: null | string;
  isSwordAnimPlaying: boolean;
  maxHealth: number;
} = {
  speed: 200,
  direction: null,
  isSwordAnimPlaying: false,
  maxHealth: 10,
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
          function updateHitboxPos() {
            const fighterPos = fighter.worldPos();
            const hitboxPos: { [key: string]: Vec2 } = {
              LEFT: k.vec2(fighterPos.x - 50, fighterPos.y),
              RIGHT: k.vec2(fighterPos.x + 50, fighterPos.y),
            };
            return hitboxPos[fighter.direction];
          }

          const attackHitbox = k.add([
            k.area({ shape: new k.Rect(k.vec2(0), 50, 50) }),
            k.anchor("center"),
            k.pos(updateHitboxPos()),
          ]);

          const enemyTag = fighter.is("samurai") ? "ninja" : "samurai";

          attackHitbox.onCollide(enemyTag, (enemy) => {
            enemy.hurt(1);
            if (enemy.hp() === 0) {
              //TODO: Game over logic.
            }
          });

          const attackUpdateRef = k.onUpdate(() => {
            attackHitbox.pos = updateHitboxPos();

            if (!fighter.isSwordAnimPlaying) attackUpdateRef.cancel();
          });

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
