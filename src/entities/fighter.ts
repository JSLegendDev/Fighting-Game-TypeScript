import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions, Entity } from "../types";

export const fighterProps: {
  speed: number;
  direction: null | string;
  isAttacking: boolean;
  isRunning: boolean;
  isDead: boolean;
  isHit: boolean;
  maxHp: number;
  previousHp: number;
  previousHeight: number;
} = {
  speed: 200,
  direction: null,
  isAttacking: false,
  isRunning: false,
  isDead: false,
  isHit: false,
  maxHp: 10,
  previousHp: 10,
  previousHeight: 0,
};

export function makeFighterBlink(k: KaboomCtx, fighter: GameObj) {
  fighter.on("hurt", async () => {
    await k.tween(
      fighter.opacity,
      0,
      0.05,
      (newOpacity) => (fighter.opacity = newOpacity),
      k.easings.linear
    );
    await k.tween(
      fighter.opacity,
      1,
      0.05,
      (newOpacity) => (fighter.opacity = newOpacity),
      k.easings.linear
    );
  });
}

export function setFighterControls(
  k: KaboomCtx,
  fighter: GameObj,
  keys: { LEFT: string; RIGHT: string; UP: string; DOWN: string }
) {
  const movementControlsRef = k.onKeyDown((key) => {
    switch (key) {
      case keys.LEFT:
        fighter.isRunning = true;
        fighter.flipX = true;
        fighter.move(-fighter.speed, 0);
        fighter.direction = Directions.LEFT;
        break;
      case keys.RIGHT:
        fighter.isRunning = true;
        fighter.flipX = false;
        fighter.move(fighter.speed, 0);
        fighter.direction = Directions.RIGHT;
        break;
      default:
    }
  });

  const actionsControlsRef = k.onKeyPress((key) => {
    switch (key) {
      case keys.UP:
        if (fighter.isGrounded()) fighter.jump();
        break;
      case keys.DOWN:
        fighter.isAttacking = true;

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
          k.wait(0.1, () => (enemy.previousHp = enemy.hp()));
          if (enemy.hp() !== 0) {
            enemy.hurt(1);
            enemy.isHit = true;
            return;
          }

          enemy.isDead = true;
        });

        const attackUpdateRef = k.onUpdate(() => {
          attackHitbox.pos = updateHitboxPos();

          if (!fighter.isAttacking) {
            k.destroy(attackHitbox);
            attackUpdateRef.cancel();
          }
        });

        break;
      default:
    }
  });

  k.onKeyRelease(() => {
    fighter.isRunning = false;
  });

  const animationManagerRef = k.onUpdate(() => {
    if (fighter.isAttacking && fighter.curAnim() !== "attack") {
      fighter.play("attack", {
        onEnd() {
          fighter.isAttacking = false;
        },
      });
    }

    if (fighter.isJumping() && fighter.curAnim() !== "jump")
      fighter.play("jump");

    if (fighter.isFalling() && fighter.curAnim() !== "fall")
      fighter.play("fall");

    if (
      fighter.isRunning &&
      !fighter.isJumping() &&
      !fighter.isFalling() &&
      !fighter.isAttacking &&
      fighter.curAnim() !== "run"
    )
      fighter.play("run");

    if (fighter.isHit && fighter.curAnim() !== "hit") {
      fighter.play("hit", {
        onEnd() {
          fighter.isHit = false;
        },
      });
    }

    if (fighter.isDead && fighter.curAnim() !== "death") {
      movementControlsRef.cancel();
      actionsControlsRef.cancel();

      // Needed since isGrounded need area comp to still exist or
      // will crash game
      fighter.isStatic = true;
      fighter.area.shape.height = 0;
      fighter.play("death", {
        onEnd() {
          animationManagerRef.cancel();
        },
      });
    }

    if (
      !fighter.isAttacking &&
      !fighter.isRunning &&
      fighter.isGrounded() &&
      !fighter.isHit &&
      !fighter.isDead &&
      fighter.curAnim() !== "idle"
    ) {
      fighter.play("idle");
    }
  });
}
