const root = document.documentElement

/**
 * The ClickGame class.
 * A game where the player clicks on the screen to earn points.
 *
 * @class ClickGame - The game object.
 */
export class ClickGame {
  /**
   * Constructs a new instance of the class.
   *
   * @param {Object} args - The options object.
   * @param {HTMLElement} args.app - The game container element.
   * @param {HTMLElement} args.canvas - The canvas element.
   * @param {HTMLElement} args.message - The message element.
   * @param {HTMLElement} args.heading - The heading element.
   * @param {HTMLElement} args.soundButton - The Sound on / off element.
   * @param {HTMLElement} args.scoreElement - The scoreboard element.
   * @param {HTMLElement} args.difficultySlider - The difficulty slider element.
   * @param {HTMLElement} args.scoreSizeSlider - The score slider element.
   * @param {HTMLElement} args.resetButton - The reset button element.
   */
  constructor ({ app: containerClass, canvas, message, heading, soundButton, scoreElement, difficultySlider, scoreSizeSlider, resetButton }) {
    // the app vars
    this.startTime = new Date().getTime()

    this.click = 0
    this.score = 0
    this.winScore = 60
    this.difficulty = 5
    this.depressurissation = 0.1
    this.pointsPerClick = this.winScore / 10
    this.endTime = 0

    this.acceleration = 0.2

    this.isGameActive = true
    this.floorPos = window.innerHeight

    // the container element
    this.container = containerClass

    // the canvas
    this.canvas = canvas
    this.width = this.canvas.width / 2
    this.height = this.canvas.height / 2

    // game elements and controls
    this.message = message
    this.heading = heading
    this.scoreElement = scoreElement
    this.difficultyRange = difficultySlider
    this.scoreRange = scoreSizeSlider
    this.resetButton = resetButton

    this.init()
  }

  /**
   * Initializes the game by setting event listeners, starting game loop,
   * and configuring game difficulty and score settings.
   *
   * @memberof ClickGame - The game object.
   * @function init - Initializes the game.
   */
  init () {
    this.difficultyRange.addEventListener('change', this.setDifficulty.bind(this), false)
    this.scoreRange.addEventListener('change', this.setPointsPerClick.bind(this), false)
    this.resetButton.addEventListener('click', this.reset.bind(this))

    this.soundButton.addEventListener('click', this.controlAudio.bind(this))
    this.sound.play()

    this.canvas.addEventListener('click', this.clickHandler.bind(this), false)

    this.interval = setInterval(this.game.bind(this), this.difficulty)
  }

  controlAudio () {
    if (this.soundOn) {
      this.soundOn = false
      this.sound.pause()
    } else {
      this.soundOn = true
      this.sound.play()
    }
  }

  setDifficulty () {
    this.difficulty = Number(this.difficultyRange.value)
    clearInterval(this.interval)
    this.interval = setInterval(this.game.bind(this), this.difficulty)
    this.reset()
  }

  setPointsPerClick () {
    this.pointsPerClick = Number(this.scoreRange.value)
    this.reset()
  }

  drawScore () {
    this.scoreElement.textContent = this.score
    this.message.textContent = `score: ${this.score} - click: ${this.click}`
  }

  reset () {
    this.score = 0
    this.click = 0
    this.message.textContent = ''
    this.scoreElement.textContent = '0'
    if (!this.isGameActive || this.canStartNewGame()) {
      this.isGameActive = true
    }
  }

  handlePlusOneAnimation (clickX, clickY) {
    // Added properties for animation
    const pointAnimation = document.createElement('img')
    pointAnimation.className = 'animated-el click-animation'

    // Click point animation
    pointAnimation.src = 'img/click.svg'
    pointAnimation.style.position = 'absolute'
    pointAnimation.style.left = clickX + 'px'
    pointAnimation.style.top = clickY + 'px'
    pointAnimation.style.transform = 'translate(-50%, -50%) scale(0.1)' // Change this value based on how high you want it to go
    pointAnimation.style.transition = 'transform 1.5s ease-out, opacity 1s ease-in'

    this.container.appendChild(pointAnimation)

    new Promise(function (resolve) {
      setTimeout(() => resolve(1), 100)
    }).then(function () {
      pointAnimation.style.transform = 'translate(-50%, -50%) scale(1)'
      pointAnimation.style.opacity = 0
      setTimeout(() => {
        pointAnimation.remove()
      }, 3000)
    })

    const clickedAnimation = document.createElement('img')
    clickedAnimation.className = 'animated-el click-animation'
    // Display +1 animation
    clickedAnimation.src = 'img/up.svg'
    clickedAnimation.className = 'up-animation'
    clickedAnimation.style.position = 'absolute'
    clickedAnimation.style.left = clickX + 'px'
    clickedAnimation.style.top = clickY + 'px'
    clickedAnimation.style.transform = 'scale(0.3) translateY(0)' // Change this value based on how high you want it to go
    clickedAnimation.style.transition = 'transform 1.5s ease-out, opacity 1s ease-in'

    this.container.appendChild(clickedAnimation)

    new Promise(function (resolve) {
      setTimeout(() => resolve(1), 100)
    }).then(function () {
      const shift = Math.round(Math.random() * 150) + 100
      clickedAnimation.style.transform = `translateY(-${shift}px) scale(1.5)`
      clickedAnimation.style.opacity = 0
      setTimeout(() => {
        clickedAnimation.remove()
      }, 3000)
    })
  }

  canStartNewGame () {
    const currentTime = new Date().getTime()
    const timeSinceWin = (currentTime - this.endTime) / 1000

    return timeSinceWin >= 5
  }

  handleGravityAnimation (clickX, clickY) {
    const fallingObject = document.createElement('img')
    fallingObject.src = 'img/gift.png.webp'
    fallingObject.className = 'animated-el flyng-gift gravity-animation'

    this.container.appendChild(fallingObject)

    const initialSpeed = Math.random() * 20 + 2 // Random speed between 2 and 7
    const initialAngle = Math.random() * -1 * Math.PI // Random angle in radians
    const initialSpin = Math.random() * -1 * Math.PI // Random angle in radians

    const velocityX = initialSpeed * Math.cos(initialAngle)
    let velocityY = initialSpeed * Math.sin(initialAngle)

    let positionX = clickX - fallingObject.width / 2
    let positionY = clickY - fallingObject.height / 2

    let spin = initialSpin

    fallingObject.style.left = positionX + 'px'
    fallingObject.style.top = positionY + 'px'

    const animate = () => {
      positionX += velocityX
      positionY += velocityY
      spin += initialSpin
      velocityY += this.acceleration
      velocityY += this.acceleration

      if (positionY > this.floorPos) {
        fallingObject.remove()
      } else {
        fallingObject.style.transform = 'rotate(' + spin + 'deg)'
        fallingObject.style.left = positionX + 'px'
        fallingObject.style.top = positionY + 'px'
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  setScore (value) {
    const valuePercentile = Math.round(value / this.win * 100)
    root.style.setProperty('--game-value', valuePercentile + '%')
    root.style.setProperty('--game-shift', valuePercentile)
  }

  clickHandler (e) {
    if (!this.isGameActive && this.canStartNewGame()) {
      // If the game is not active, reset and start a new game
      this.reset()
      this.isGameActive = true
      this.startTime = new Date().getTime()
    } else {
      if (this.score !== this.winScore && this.isGameActive) {
        this.score += this.pointsPerClick
        this.setScore(this.score)
        this.click++

        // Get canvas position
        const canvasRect = this.container.getBoundingClientRect()

        // Calculate click coordinates relative to the canvas
        const clickX = e.clientX - canvasRect.left
        const clickY = e.clientY - canvasRect.top

        this.handlePlusOneAnimation(clickX, clickY)
        this.handleGravityAnimation(clickX, clickY)
      }
    }
  }

  winnerWinner () {
    this.isGameActive = false // Pause the game
    this.endTime = new Date().getTime()
    const timeElapsed = (this.endTime - this.startTime) / 1000 // Convert to seconds

    const timeFactor = 1000 / timeElapsed // Adjust as needed
    const clickFactor = 1000 * this.click // Adjust as needed
    const difficultyFactor = 1000 / parseInt(this.difficulty)
    const scoreValueFactor = 100000 / parseInt(this.pointsPerClick)

    const overallScore = Math.floor((timeFactor + clickFactor + difficultyFactor + scoreValueFactor) / 4)

    this.message.textContent = `YOU WIN 🎉!\nScore: ${overallScore}`
    this.scoreElement.textContent = 'WIN 60'
    this.heading.textContent = `Time: ${timeElapsed.toFixed(2)}s - Clicks: ${this.click}`
  }

  /**
   * Updates the game state and renders the game on the canvas.
   *
   * @return {boolean} Returns true if the game is over, false otherwise.
   */
  game () {
    if (this.isGameActive) {
      if (this.score === 0) {
        this.message.textContent = 'tap the screen to start'
        this.scoreElement.textContent = '0'
        this.heading.textContent = `difficulty: ${this.difficulty} - ppc: ${this.pointsPerClick}`
      } else {
        this.drawScore()
      }
    }

    if (this.score >= this.win) {
      if (this.isGameActive) {
        this.winnerWinner()
      } else {
        return true
      }
    } else if (this.score === 0) {
      this.score = 0
      this.startTime = new Date().getTime()
    } else {
      this.score -= this.depressurissation
      this.setScore(this.score)
    }
  }
}
