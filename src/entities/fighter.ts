import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions } from "../types";

export const fighterProps: {
  speed: number;
  direction: null | string;
  isUnskipAnimPlaying: boolean;
  maxHp: number;
  previousHp: number;
} = {
  speed: 200,
  direction: null,
  isUnskipAnimPlaying: false,
  maxHp: 10,
  previousHp: 10,
};

export function setFighterControls(
  k: KaboomCtx,
  fighter: GameObj,
  keys: { LEFT: string; RIGHT: string; UP: string; DOWN: string }
) {
  k.onKeyDown((key) => {
    if (fighter.isUnskipAnimPlaying) return;

    switch (key) {
      case keys.LEFT:
        fighter.flipX = true;
        fighter.move(-fighter.speed, 0);
        if (fighter.curAnim() !== "run" || fighter.curAnim() !== "jump")
          fighter.play("run");
        fighter.direction = Directions.LEFT;
        break;
      case keys.RIGHT:
        fighter.flipX = false;
        fighter.move(fighter.speed, 0);
        if (fighter.curAnim() !== "run" || fighter.curAnim() !== "jump")
          fighter.play("run");
        fighter.direction = Directions.RIGHT;
        break;
      default:
    }
  });

  k.onKeyPress((key) => {
    if (fighter.hp() <= 0) return;

    switch (key) {
      case keys.UP:
        if (fighter.isGrounded()) fighter.jump();
        if (fighter.curAnim() !== "jump") fighter.play("jump");
        break;
      case keys.DOWN:
        if (!fighter.isUnskipAnimPlaying) {
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
            enemy.isUnskipAnimPlaying = true;
            enemy.play("hit", {
              onEnd() {
                enemy.isUnskipAnimPlaying = false;
              },
            });
            enemy.previousHp = enemy.hp();
            enemy.hurt(1);

            k.wait(0.1, () => (enemy.previousHp = enemy.hp()));
            if (enemy.hp() === 0) {
              enemy.isUnskipAnimPlaying = true;
              enemy.play("death");
            }
          });

          const attackUpdateRef = k.onUpdate(() => {
            attackHitbox.pos = updateHitboxPos();

            if (!fighter.isUnskipAnimPlaying) attackUpdateRef.cancel();
          });

          fighter.isUnskipAnimPlaying = true;
          fighter.play("attack", {
            onEnd() {
              k.destroy(attackHitbox);
              fighter.isUnskipAnimPlaying = false;
            },
          });
        }
        break;
      default:
    }
  });

  k.onUpdate(() => {
    if (
      fighter.curAnim() !== "idle" &&
      fighter.curAnim() !== "run" &&
      fighter.curAnim() !== "jump" &&
      !fighter.isUnskipAnimPlaying
    ) {
      fighter.play("idle");
    }
  });

  k.onKeyRelease(() => {
    if (fighter.hp() <= 0) return;

    if (fighter.curAnim() === "run") fighter.play("idle");
  });
}
