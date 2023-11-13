import { Entity } from "../types";

type GlobalState = {
  getPlayer1: () => Entity | null;
  getPlayer2: () => Entity | null;
  setPlayer1: (playerRef: Entity) => void;
  setPlayer2: (playerRef: Entity) => void;
};

function globalStateManager() {
  let instance: GlobalState | null = null;

  function createInstance() {
    let player1: Entity | null;
    let player2: Entity | null;

    return {
      getPlayer1: () => player1,
      getPlayer2: () => player2,
      setPlayer1(playerRef: Entity) {
        player1 = playerRef;
      },
      setPlayer2(playerRef: Entity) {
        player2 = playerRef;
      },
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
}

const globalState = globalStateManager().getInstance();

export default globalState;
