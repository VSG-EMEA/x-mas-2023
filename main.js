import './style.css'

import { ClickGame } from './src/script.js'

const app = document.querySelector('#app')

app.innerHTML = `
<div class="relative bg-[url('/img/background.jpg')] text-white w-screen h-screen flex flex-col justify-center items-center">
  
    <div id="headline" class="absolute top-8 left-8 flex flex-col gap-0">
        <h4 class="text-white text-2xl uppercase leading-compact font-regular">Blitz Series</h4>
        <h1 id="title" class="text-7xl uppercase leading-compact font-bold text-red-600" >Portal Lift</h1>
    </div>
    
    <div id="scoreboard" class="absolute top-16 flex flex-col gap-0 text-center">
        <p id="current-score" class="text-white text-7xl uppercase leading-compact font-medium"><span>0</span> Ton</p>
        <p id="message" class="text-white text-4xl leading-compact font-light">Click the Pit Lift to <b >Start</b></p>
        <h3 id="heading"></h3>
    </div>
    
    <div id="game-item" class="absolute top-0 left-0 w-screen h-screen">
        <img id="game-background" src="/img/portal-01.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" /> 
        <img id="game-lift" src="/img/portal-02.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" style="transform: translateY( calc( 200px - var( --game-shift ) * 2px  ) " />  
        <img id="game-front" src="/img/portal-03.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" /> 
    </div>
    
    <div id="game-powerbar" class="absolute flex align-bottom justify-center left-8 w-20 h-2/4 box-content bg-black bg-opacity-50 rounded-full border border-white overflow-hidden">
        <div id="powerbar-wrapper" class="w-full relative">
          <div id="powerbar-shadow" class="absolute top-0 bottom-0 left-0 w-full opacity-30"></div>
          <div id="powerbar-crop" class="absolute bottom-0 left-0 w-full overflow-hidden" style="height: var(--game-value) !important;">
            <div id="powerbar" class="absolute top-0 bottom-0 left-0 w-full"></div>
          </div>
        </div>
    </div>

    <div class="flex align-middle justify-between">
      <div id="action-buttons" class="absolute bottom-8 left-8 flex gap-4 items-center flex-start">
        
        <button id="sound" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-1-solid text-white font-medium text-2xl uppercase h-16 px-4">
            <img src="/img/sound.svg" class="h-8">
        </button>
        
        <button id="reset" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-1-solid text-white font-medium text-2xl uppercase h-16 px-4">Reset</button>
        <p>
            <label for="slider-difficulty">Difficulty:</label>
            <input type="range" min="1" max="10" value="5" id="slider-difficulty" />
        </p>
        <p>
            <label for="slider-score-size">Size:</label>
            <input type="range" min="1" max="500" value="50" id="slider-score-size" />
        </p>
      </div>
        
      <div id="logo" class="absolute bottom-8 right-8">
        <img src="/img/logo.png.webp" alt="" class="w-36 float-right">
      </div>
  </div>
</div>
`
new ClickGame({
  app,
  canvas: document.getElementById('game-item'),
  message: document.getElementById('message'),
  heading: document.getElementById('heading'),
  soundButton: document.getElementById('sound'),
  scoreElement: document.querySelector('#scoreboard #current-score span'),
  difficultySlider: document.getElementById('slider-difficulty'),
  scoreSizeSlider: document.getElementById('slider-score-size'),
  resetButton: document.getElementById('reset')
})
