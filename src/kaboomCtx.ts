import kaboom from "kaboom";

const k = kaboom({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false,
  debug: false, // Remember to put this back to false, when releasing the game
});

export default k;
