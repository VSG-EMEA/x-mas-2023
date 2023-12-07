import './style.css'

import { ClickGame } from './src/script.js'

const app = document.querySelector('#app')

app.innerHTML = `
<div class="game-wrapper relative text-white w-screen h-screen flex flex-col justify-center items-center">
    
      <div id="headline" class="absolute top-10 left-10 flex flex-col gap-0 w-1/2 md:w-1/3 text-center md:text-left">
          <h4 class="text-white text-xl md:text-2xl uppercase leading-compact font-regular">Blitz Series</h4>
      </div>
      
      <div class="absolute top-16 left-10 right-10 flex md:flex-row flex-col align-start justify-start">
          <h1 id="title" class="text-3xl md:text-7xl uppercase leading-compact font-bold text-center md:text-left text-red-400 w-full md:w-1/3" >Portal Lift</h1>      
          <p id="current-score" class="text-white text-center text-3xl md:text-7xl uppercase leading-compact font-medium w-full md:w-1/3"><span></span></p>
      </div>
      
      <div id="scoreboard" class="absolute top-36 flex flex-col gap-0 text-center leading-10">
          <p id="message" class="text-white text-xl md:text-4xl leading-compact font-light">Click the Pit Lift to <b >Start</b></p>
      </div>
      
    
    <div id="game-item" class="absolute top-0 left-0 w-screen h-screen">
        <img id="game-background" src="img/portal-01.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" /> 
        <img id="game-lift" src="img/portal-02.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" style="transform: translateY( calc(  var( --game-shift ) * -0.12vh  ) " />  
        <img id="game-front" src="img/portal-03.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" /> 
    </div>

    <div id="game-powerbar" class="absolute left-10 md:bottom-inherit bottom-36 box-content bg-black bg-opacity-50 px-3 py-8 rounded-full border border-white overflow-hidden shadow-black shadow-xl">
        <div id="powerbar-wrapper" class="relative">
          <div id="powerbar-shadow" class="opacity-30"></div>
          <div id="powerbar-crop" class="absolute bottom-0 left-0 w-full overflow-hidden" style="height: var(--game-value) !important;">
            <div id="powerbar" class="absolute bottom-0 left-0"></div>
          </div>
        </div>
    </div>

    <div class="flex align-middle justify-between">
      <div id="action-buttons" class="absolute bottom-10 left-10 flex gap-4 items-center flex-start">
        
        <button id="sound" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-1-solid text-white font-medium text-base md:text-2xl uppercase h-12 md:h-16 px-4">
            <img src="img/sound.svg" class="h-6 md:h-8">
        </button>
        
        <button id="reset" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-1-solid text-white font-medium text-xl md:text-2xl uppercase h-12 md:h-16 px-4">
          Reset
        </button>
        <p class="hidden">
            <label for="slider-difficulty">Difficulty:</label>
            <input type="range" min="1" max="10" value="5" id="slider-difficulty" />
        </p>
        <p class="hidden">
            <label for="slider-score-size">Size:</label>
            <input type="range" min="1" max="500" value="50" id="slider-score-size" />
        </p>
      </div>
        
      <div id="logo" class="absolute bottom-10 right-10">
        <img src="img/logo.png.webp" alt="" class="w-24 md:w-36 float-right">
      </div>
  </div>
</div>
`

const g = new ClickGame({
  app,
  canvas: document.getElementById('game-item'),
  message: document.getElementById('message'),
  heading: document.getElementById('heading'),
  soundButton: document.getElementById('sound'),
  scoreElement: document.querySelector('#current-score span'),
  difficultySlider: document.getElementById('slider-difficulty'),
  scoreSizeSlider: document.getElementById('slider-score-size'),
  resetButton: document.getElementById('reset')
})

g.canStartNewGame()
