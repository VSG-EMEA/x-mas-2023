import './style.css'

import { ClickGame } from './src/script.js'

const app = document.querySelector('#app')

app.innerHTML = `
<div class="game-wrapper relative text-white w-screen h-screen flex flex-col justify-center items-center">
    
    <div id="headline" class="absolute top-6 left:6 md:left-8 w-1/2 md:w-1/3 text-center md:text-left">
        <h4 class="text-white text-default md:text-xl leading-none font-regular uppercase">2-Post lift - Legend Series</h4>
    </div>
    
    <div class="absolute top-12 md:top-12 left-8 right-8 flex md:flex-row flex-col align-center justify-start">
        <h1 id="title" class="text-4xl lg:text-4xl md:text-7xl uppercase leading-none font-black text-center md:text-left text-white w-full md:w-4/12" >KPX55LIKTA</h1>      
        <p id="current-score" class="text-white text-center text-4xl md:text-7xl uppercase leading-none font-black w-full md:w-4/12"><span></span></p>
    </div>
    
    <div id="scoreboard" class="absolute top-40 md:top-40 flex flex-col gap-0 text-center">
        <p id="message" class="text-white text-2xl md:text-3xl leading-none font-light">Click the Pit Lift to <b >Start</b></p>
    </div>
    
    <div id="game-item" class="absolute top-0 left-0 w-screen h-screen">
        <img id="game-background" 
             src="img/lift-01.png.webp" 
             srcset="img/lift-01-mobile.png.webp 640w, img/lift-01.png.webp 1024w"
             sizes="(max-width: 1024px) 640px, 1024px" 
             alt="" class="absolute top-0 left-0 w-full h-full object-cover" />  
        <img id="game-lift" 
             src="img/lift-02.png.webp" 
             srcset="img/lift-02-mobile.png.webp 640w, img/lift-02.png.webp 1024w"
             sizes="(max-width: 1024px) 640px, 1024px" 
             alt="" class="absolute top-0 left-0 w-full h-full object-cover"
             style="transform: translateY( calc(  var( --game-shift ) * -0.12vh  ) " />  
        <img id="game-front" 
             src="img/lift-03.png.webp" 
             srcset="img/lift-03-mobile.png.webp 640w, img/lift-03.png.webp 1024w"
             sizes="(max-width: 1024px) 640px, 1024px" 
             alt="" class="absolute top-0 left-0 w-full h-full object-cover" />   
    </div>

    <div id="game-powerbar" class="absolute left-6 md:left-10 bottom-36 md:bottom-auto box-content px-2 md:px-4 py-8 rounded-full border border-white overflow-hidden shadow-white shadow-xl">
        <div id="powerbar-wrapper" class="relative">
          <div id="powerbar-shadow" class="opacity-30"></div>
          <div id="powerbar-crop" class="absolute bottom-0 left-0 w-full overflow-hidden" style="height: var(--game-value) !important;">
            <div id="powerbar" class="absolute bottom-0 left-0"></div>
          </div>
        </div>
    </div>

    <div class="flex align-middle justify-between">
    
      <div id="action-buttons" class="absolute bottom-6 md:bottom-10 left-6 md:left-8 flex gap-4 items-center flex-start">
        <button id="sound" class="bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-black border-opacity-30 border-1-solid h-12 md:h-16 px-4">
            <img src="img/sound.svg" class="h-6 md:h-8">
        </button>
        
        <button id="reset" class="bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-black border-opacity-30 border-1-solid text-blue-400 font-black text-xl md:text-2xl uppercase h-12 md:h-16 px-4">
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
        
      <div id="logo" class="absolute bottom-6 md:bottom-10 right-6 md:right-8">
        <img src="img/logo.png.webp" alt="" class="w-24 md:w-36 float-right">
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
