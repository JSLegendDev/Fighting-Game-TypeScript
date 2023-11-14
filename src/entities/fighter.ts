import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions, Entity } from "../types";

export const fighterProps: {
  speed: number;
  direction: null | string;
  isUnskipAnimPlaying: boolean;
  isSkipAnimPlaying: boolean;
  maxHp: number;
  previousHp: number;
  previousHeight: number;
} = {
  speed: 200,
  direction: null,
  isUnskipAnimPlaying: false,
  isSkipAnimPlaying: false,
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
  k.onKeyDown((key) => {
    if (fighter.isUnskipAnimPlaying) return;

    if (key === keys.LEFT) {
      fighter.flipX = true;
      fighter.move(-fighter.speed, 0);
      fighter.direction = Directions.LEFT;
      if (fighter.curAnim() !== "run") {
        fighter.play("run");
        fighter.isSkipAnimPlaying = true;
      }
      return;
    }

    if (key === keys.RIGHT) {
      fighter.flipX = false;
      fighter.move(fighter.speed, 0);
      fighter.direction = Directions.RIGHT;
      if (fighter.curAnim() !== "run") {
        fighter.play("run");
        fighter.isSkipAnimPlaying = true;
      }
      return;
    }
  });

  k.onKeyRelease((key) => {
    if (key === keys.LEFT || key === keys.RIGHT) {
      fighter.isSkipAnimPlaying = false;
    }
  });

  k.onKeyPress((key) => {
    if (
      key === keys.UP &&
      fighter.isGrounded() &&
      fighter.curAnim() !== "jump"
    ) {
      fighter.jump();
      fighter.play("jump");
      fighter.isUnskipAnimPlaying = true;
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
        fighter.isUnskipAnimPlaying = true;
        fighter.play("attack", {
          onEnd: () => {
            fighter.isUnskipAnimPlaying = false;
          },
        });
      }
      k.wait(0.3, () => {
        k.destroy(attackHitbox);
        attackUpdateRef.cancel();
      });
    }
  });

  k.onUpdate(() => {
    // console.log({
    //   skipAnimPlaying: fighter.isSkipAnimPlaying,
    //   unSkipAnimPlaying: fighter.isUnskipAnimPlaying,
    // });

    if (
      !fighter.isJumping() &&
      !fighter.isGrounded() &&
      fighter.curAnim() !== "fall"
    ) {
      fighter.play("fall");
    }

    if (fighter.curAnim() === "fall" && fighter.isGrounded()) {
      fighter.isUnskipAnimPlaying = false;
    }

    if (
      fighter.curAnim() !== "idle" &&
      !fighter.isUnskipAnimPlaying &&
      !fighter.isSkipAnimPlaying
    ) {
      fighter.play("idle");
    }
  });
}
