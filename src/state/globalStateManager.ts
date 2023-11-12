import { GameObj } from "kaboom";

type GlobalState = {
  getPlayer1: () => GameObj | null;
  getPlayer2: () => GameObj | null;
  setPlayer1: (playerRef: GameObj) => void;
  setPlayer2: (playerRef: GameObj) => void;
};

function globalStateManager() {
  let instance: GlobalState | null = null;

  function createInstance() {
    let player1: GameObj | null;
    let player2: GameObj | null;

    return {
      getPlayer1: () => player1,
      getPlayer2: () => player2,
      setPlayer1(playerRef: GameObj) {
        player1 = playerRef;
      },
      setPlayer2(playerRef: GameObj) {
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
