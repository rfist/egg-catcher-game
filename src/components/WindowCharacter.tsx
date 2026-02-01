import windowCharacterSprite from '../assets/characters/timoshenko.svg';

interface WindowCharacterProps {
  visible: boolean;
}

/**
 * Window character that appears randomly.
 * When visible, reduces penalty for missed eggs by half.
 */
export function WindowCharacter({ visible }: WindowCharacterProps) {
  return (
    <img
      src={windowCharacterSprite}
      alt="Window character"
      className="window-character"
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    />
  );
}
