import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions, Entity } from "../types";

export const fighterProps: {
  speed: number;
  direction: null | string;
  isDead: boolean;
  maxHp: number;
  previousHp: number;
  previousHeight: number;
} = {
  speed: 200,
  direction: null,
  isDead: false,
  maxHp: 10,
  previousHp: 10,
  previousHeight: 0,
};

export async function makeFighterBlink(k: KaboomCtx, fighter: GameObj) {
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
}

export function setFighterControls(
  k: KaboomCtx,
  fighter: GameObj,
  keys: { LEFT: string; RIGHT: string; UP: string; DOWN: string }
) {
  const onKeyDownListener = k.onKeyDown((key) => {
    if (fighter.curAnim() === "attack") return;

    if (key === keys.LEFT) {
      fighter.flipX = true;
      fighter.move(-fighter.speed, 0);
      fighter.direction = Directions.LEFT;
      if (fighter.curAnim() !== "run" && fighter.curAnim() !== "jump") {
        fighter.play("run");
      }
      return;
    }

    if (key === keys.RIGHT) {
      fighter.flipX = false;
      fighter.move(fighter.speed, 0);
      fighter.direction = Directions.RIGHT;
      if (fighter.curAnim() !== "run" && fighter.curAnim() !== "jump") {
        fighter.play("run");
      }
      return;
    }
  });

  const onKeyReleaseListener = k.onKeyRelease((key) => {
    if (
      (key === keys.LEFT || key === keys.RIGHT) &&
      fighter.curAnim() !== "idle"
    ) {
      fighter.play("idle");
    }
  });

  const onKeyPressListener = k.onKeyPress((key) => {
    if (
      key === keys.UP &&
      fighter.isGrounded() &&
      fighter.curAnim() !== "jump"
    ) {
      fighter.jump();
      fighter.play("jump");
    }

    if (key === keys.DOWN) {
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
        k.wait(0.1, () => (enemy.previousHp = enemy.hp()));
        if (enemy.hp() !== 0) {
          enemy.hurt(1);
          return;
        }
      });

      const attackUpdateRef = k.onUpdate(() => {
        attackHitbox.pos = updateHitboxPos();
      });

      if (fighter.curAnim() !== "attack") {
        fighter.play("attack");
      }

      k.wait(0.3, () => {
        k.destroy(attackHitbox);
        attackUpdateRef.cancel();
      });
    }
  });

  fighter.on("hurt", () => {
    makeFighterBlink(k, fighter);
    if (fighter.hp() > 0 && fighter.curAnim !== "hit") {
      fighter.play("hit");
      return;
    }

    if (fighter.curAnim !== "death") {
      fighter.isDead = true;
      onKeyDownListener.cancel();
      onKeyReleaseListener.cancel();
      onKeyPressListener.cancel();
      fighter.isStatic = true;
      fighter.area.shape.height = 0;
      fighter.play("death");
    }
  });

  k.onUpdate(() => {
    if (
      !fighter.isJumping() &&
      !fighter.isGrounded() &&
      fighter.curAnim() !== "fall" &&
      fighter.curAnim() !== "attack"
    ) {
      fighter.play("fall");
    }

    if (fighter.curAnim() === "fall" && fighter.isGrounded()) {
      fighter.play("idle");
      return;
    }

    if (
      fighter.curAnim() !== "idle" &&
      fighter.curAnim() !== "jump" &&
      fighter.curAnim() !== "attack" &&
      fighter.curAnim() !== "hit" &&
      fighter.curAnim() !== "fall" &&
      fighter.curAnim() !== "run" &&
      !fighter.isDead
    ) {
      fighter.play("idle");
    }
  });
}
