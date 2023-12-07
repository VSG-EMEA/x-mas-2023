import './style.css'

import { ClickGame } from './src/script.js'

const app = document.querySelector('#app')

app.innerHTML = `
<div class="relative lg:bg-[url('/img/background.jpg')] bg-[url('/img/background-mobile.jpg')] text-white w-screen h-screen flex flex-col justify-center items-center">
    
      <div id="headline" class="absolute top-10 left-10 flex flex-col gap-0 w-1/3">
          <h4 class="text-white text-2xl uppercase leading-compact font-regular">Blitz Series</h4>
      </div>
      
      <div class="absolute top-16 left-10 right-10 flex align-start justify-start">
          <h1 id="title" class="text-7xl uppercase leading-compact font-bold text-red-400 w-1/3" >Portal Lift</h1>      
          <p id="current-score" class="text-white text-center text-7xl uppercase leading-compact font-medium w-1/3"><span>0</span> Ton</p>
      </div>
      
      <div id="scoreboard" class="absolute top-36 flex flex-col gap-0 text-center leading-10">
          <p id="message" class="text-white text-4xl leading-compact font-light">Click the Pit Lift to <b >Start</b></p>
          <h3 id="heading"></h3>
      </div>
      
    
    <div id="game-item" class="absolute top-0 left-0 w-screen h-screen">
        <img id="game-background" src="img/portal-01.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" /> 
        <img id="game-lift" src="img/portal-02.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" style="transform: translateY( calc(  var( --game-shift ) * -0.16vh  ) " />  
        <img id="game-front" src="img/portal-03.png.webp" alt="" class="absolute top-0 left-0 w-full h-full object-cover" /> 
    </div>
    
    <div id="game-powerbar" class="absolute flex align-bottom justify-center left-10 w-[80px] h-1/2 box-content bg-black bg-opacity-50 rounded-full border border-white overflow-hidden shadow shadow-black">
        <div id="powerbar-wrapper" class="w-full relative">
          <div id="powerbar-shadow" class="absolute top-0 bottom-0 left-0 w-full h-1/2 opacity-30"></div>
          <div id="powerbar-crop" class="absolute bottom-0.5 left-0 w-full h-1/2 overflow-hidden" style="height: var(--game-value) !important;">
            <div id="powerbar" class="absolute top-0 bottom-0 left-0 h-1/2 w-full"></div>
          </div>
        </div>
    </div>

    <div class="flex align-middle justify-between">
      <div id="action-buttons" class="absolute bottom-10 left-10 flex gap-4 items-center flex-start">
        
        <button id="sound" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-1-solid text-white font-medium text-2xl uppercase h-16 px-4">
            <img src="img/sound.svg" class="h-8">
        </button>
        
        <button id="reset" class="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-1-solid text-white font-regular text-2xl uppercase h-16 px-4">
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
        <img src="img/logo.png.webp" alt="" class="w-36 float-right">
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
  scoreElement: document.querySelector('#current-score span'),
  difficultySlider: document.getElementById('slider-difficulty'),
  scoreSizeSlider: document.getElementById('slider-score-size'),
  resetButton: document.getElementById('reset')
})
