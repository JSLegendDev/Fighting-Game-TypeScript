import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions } from "../types";

export function makeHealthbar(
  k: KaboomCtx,
  direction: Directions,
  owner: GameObj
) {
  const healthContainerPos: { [key: string]: Vec2 } = {
    LEFT: k.vec2(310, 40),
    RIGHT: k.vec2(972, 40),
  };

  const healthContainer = k.add([
    k.rect(600, 50),
    k.color(200, 0, 0),
    k.area(),
    k.anchor("center"),
    k.outline(4),
    k.pos(healthContainerPos[direction]),
    k.fixed(),
  ]);

  const healthDisplay = healthContainer.add([
    k.rect(600, 46),
    k.color(0, 200, 0),
    k.pos(-300, -23),
    k.rotate(0),
  ]);

  if (direction === Directions.RIGHT) {
    healthDisplay.rotateBy(180);
    healthDisplay.pos = k.vec2(300, 23);
  }

  const reduceWidthBy = healthDisplay.width / owner.maxHp;
  k.onUpdate(() => {
    if (owner.hp() === owner.previousHp) return;

    owner.previousHp = owner.hp();
    if (owner.hp() !== 0) {
      k.tween(
        healthDisplay.width,
        healthDisplay.width - reduceWidthBy,
        0.1,
        (newWidth) => (healthDisplay.width = newWidth),
        k.easings.linear
      );

      return;
    }

    k.tween(
      healthDisplay.width,
      0,
      0.1,
      (newWidth) => (healthDisplay.width = newWidth),
      k.easings.linear
    );
  });
}
