import { GameScene } from './components/GameScene'
import { AssetPreloader } from './components/AssetPreloader'
import './App.css'

function App() {
  return (
    <div className="app">
      <AssetPreloader />
      <h1>Professor's Fall</h1>
      <p className="subtitle">Egg Catching Game - Scene Preview</p>
      <GameScene />
    </div>
  )
}

export default App
