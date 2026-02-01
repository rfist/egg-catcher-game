import './GameScene.css';

// Constants
import { MAX_PENALTY_POINTS } from '../constants/gameConfig';

// Hooks
import { useGameLoop } from '../hooks/useGameLoop';

// Components
import { Catcher } from './Catcher';
import { WindowCharacter } from './WindowCharacter';
import { EggLayer } from './EggLayer';
import { MissAnimation } from './MissAnimation';
import { PenaltyDisplay } from './PenaltyDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { GameMessage } from './GameMessage';

// Assets
import backgroundSvg from '../assets/background/scene.svg';

export function GameScene() {
  const { gameState } = useGameLoop();
  
  const {
    score,
    penaltyPoints,
    catchPosition,
    gameRunning,
    windowCharacterVisible,
    missAnimationSide,
    missAnimationFrame,
    activeEggs,
  } = gameState;

  const isGameOver = penaltyPoints >= MAX_PENALTY_POINTS;
  const showStartMessage = !gameRunning && !isGameOver;

  return (
    <div className="game-container">
      <img src={backgroundSvg} alt="Game background" className="background" />

      <WindowCharacter visible={windowCharacterVisible} />

      <Catcher position={catchPosition} failSide={missAnimationSide} />

      <MissAnimation side={missAnimationSide} frame={missAnimationFrame} />

      <EggLayer activeEggs={activeEggs} hidden={missAnimationSide !== null} />

      <PenaltyDisplay penaltyPoints={penaltyPoints} />

      <ScoreDisplay score={score} />

      {showStartMessage && <GameMessage type="start" />}

      {isGameOver && <GameMessage type="gameover" score={score} />}
    </div>
  );
}
