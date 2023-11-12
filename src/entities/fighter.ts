import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions } from "../types";

export const fighterProps: {
  speed: number;
  direction: null | string;
  isSwordAnimPlaying: boolean;
  maxHp: number;
  previousHp: number;
} = {
  speed: 200,
  direction: null,
  isSwordAnimPlaying: false,
  maxHp: 10,
  previousHp: 10,
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
        fighter.direction = Directions.LEFT;
        break;
      case keys.RIGHT:
        fighter.flipX = false;
        fighter.move(fighter.speed, 0);
        if (fighter.curAnim() !== "run") fighter.play("run");
        fighter.direction = Directions.RIGHT;
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
            enemy.previousHp = enemy.hp();
            enemy.hurt(1);
            if (enemy.curAnim() !== "hit") enemy.play("hit");
            k.wait(0.1, () => (enemy.previousHp = enemy.hp()));
            if (enemy.hp() === 0) {
              k.debug.log("died");
              enemy.play("death");
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
    if (fighter.hp() <= 0) return;

    if (
      fighter.curAnim() !== "idle" &&
      fighter.curAnim() !== "attack" &&
      fighter.curAnim() !== "hit"
    )
      fighter.play("idle");
  });
}
