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
   * @param {HTMLElement} args.soundButton - The Sound on / off element.
   * @param {HTMLElement} args.scoreElement - The scoreboard element.
   * @param {HTMLElement} args.difficultySlider - The difficulty slider element.
   * @param {HTMLElement} args.scoreSizeSlider - The score slider element.
   * @param {HTMLElement} args.resetButton - The reset button element.
   */
  constructor ({ app: containerClass, canvas, message, soundButton, scoreElement, difficultySlider, scoreSizeSlider, resetButton }) {
    // the app vars
    this.startTime = new Date().getTime()

    this.click = 0
    this.score = 0
    this.scoreEased = 0
    this.easedUpdateTime = 0
    this.winScore = 60
    this.difficulty = 5
    this.depressurissation = 0.06
    this.pointsPerClick = this.winScore / 20
    this.endTime = 0

    // sound settings
    this.soundOn = false
    this.sound = new Audio('./sounds/christmas-rock.mp3')

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
    this.scoreElement = scoreElement
    this.soundButton = soundButton
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
    setTimeout(function () {
      // Hide the address bar:
      window.scrollTo(0, 1)
    }, 0)

    /**
     * Game reset, difficulty and score settings
     */
    this.difficultyRange.addEventListener('change', this.setDifficulty.bind(this), false)
    this.scoreRange.addEventListener('change', this.setPointsPerClick.bind(this), false)
    this.resetButton.addEventListener('click', this.reset.bind(this))

    /**
     * The game loop.
     * @type {number}
     */
    this.interval = setInterval(this.game.bind(this), this.difficulty)

    /**
     * Audio control
     */
    this.soundButton.addEventListener('click', this.controlAudio.bind(this))
    this.soundButton.click()

    document.body.addEventListener('click', this.userInteractionHandler)
    document.body.addEventListener('touchstart', this.userInteractionHandler)
    document.body.addEventListener('keydown', this.userInteractionHandler)
  }

  // Add user interaction listener
  userInteractionHandler = async () => {
    await this.startAudio(true)
    document.body.removeEventListener('click', this.userInteractionHandler)
    document.body.removeEventListener('touchstart', this.userInteractionHandler)
    document.body.removeEventListener('keydown', this.userInteractionHandler)
  }

  /**
   * Controls the audio playback.
   *
   * @async
   * @param {boolean} forceEnabled - Whether to force enabling the sound even if it is currently disabled.
   * @return {Promise<void>} - A Promise that resolves when the audio playback is controlled.
   */
  controlAudio () {
    if (this.soundOn) {
      this.sound.play().then(() => {
        this.soundButton.classList.remove('sound-off')
      })
    } else {
      this.sound.pause()
      this.soundButton.classList.add('sound-off')
    }

    this.soundOn = !this.soundOn
  }

  startAudio () {
    this.sound.play().then(() => {
      this.soundButton.classList.remove('sound-off')
    })
  }

  /**
   * Vibrates the phone for a specified duration.
   * If the vibration API is not supported, it logs a message to the console.
   *
   * @return {void}
   */
  vibratePhone () {
    // Check if the vibration API is supported
    if ('vibrate' in navigator) {
      // Vibrate for 100 milliseconds (0.1 second)
      navigator.vibrate(100)
    } else {
      console.log('Vibration API not supported')
    }
  }

  /**
   * Sets the difficulty of the game.
   *
   * The difficulty is set based on the value of `difficultyRange` property.
   * It assigns the value as a number to the `difficulty` property.
   * It then clears the existing interval and creates a new interval for the game loop
   * with the new difficulty value. Finally, it resets the game.
   *
   * @return {void}
   */
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

  roundToTwo (num) {
    return Math.round(num * 100) / 100
  }

  reset () {
    this.click = 0
    this.message.innerHTML = 'Click the Pit Lift to<br/><b>START</b>'
    this.scoreElement.textContent = '0 TON'
    this.score = 0
    if (this.canStartNewGame()) {
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
    pointAnimation.style.opacity = 0.75
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

  /**
   * Checks if a new game can be started based on the time elapsed since the last game ended.
   * @returns {boolean} Returns true if enough time has passed since the last game ended, otherwise false.
   */
  canStartNewGame () {
    const currentTime = new Date().getTime()
    const timeSinceWin = (currentTime - this.endTime) / 1000

    return timeSinceWin >= 5
  }

  /**
   * Calculates the ease out value based on the input time.
   *
   * @param {number} t - The time value between 0 and 1.
   * @returns {number} - The calculated ease out value.
   */
  easeOut (t) {
    return t * (2 - t)
  }

  /**
   * Handles the gravity animation of a falling object.
   *
   * @param {number} clickX - The x-coordinate of the click position.
   * @param {number} clickY - The y-coordinate of the click position.
   */
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

    /**
     * Function to animate a falling object on the screen.
     * @function animate
     */
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

  /**
   * Updates and displays the score on the screen using easing.
   * The score is updated every 100 milliseconds.
   *
   * @method drawScore
   * @memberof ClickGame
   *
   * @return {void} This method does not return a value.
   */
  drawScore () {
    const currentTime = new Date().getTime()
    const timeSinceLastUpdate = currentTime - this.easedUpdateTime

    // Update the eased score every 100 milliseconds
    if (timeSinceLastUpdate > 20) {
      this.easedUpdateTime = currentTime
      const easingFactor = 0.2

      // Apply easing to smoothly update the eased score
      this.scoreEased += (this.score - this.scoreEased) * easingFactor
    }

    this.scoreElement.textContent = this.roundToTwo(this.scoreEased).toFixed(2).padStart(5, '0') + ' TON' ?? '0 TON'
  }

  /**
   * Sets the score value and updates the game display.
   *
   * @param {number} value - The value of the score to set.
   * @return {void}
   */
  setScore (value) {
    const valuePercentile = Math.round(value / this.winScore * 100)
    const easedValuePercentile = this.easeOut(valuePercentile / 100) // Apply easing
    this.scoreEased = easedValuePercentile * this.winScore

    root.style.setProperty('--game-value', easedValuePercentile * 100 + '%')
    root.style.setProperty('--game-shift', easedValuePercentile * 100)
  }

  /**
   * Handles the click event for the game.
   *
   * @param {MouseEvent} e - The click event object.
   * @returns {void}
   */
  clickHandler (e) {
    if (!this.isGameActive && this.canStartNewGame()) {
      // If the game is not active, reset and start a new game
      this.reset()
      this.startTime = new Date().getTime()
      this.isGameActive = true
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

  /**
   * Pauses the game, calculates the overall score, and updates the score and message elements.
   * Uses the vibration API to vibrate the phone for 0.1 seconds if supported.
   *
   * @returns {void}
   */
  winner () {
    this.isGameActive = false // Pause the game
    this.endTime = new Date().getTime()
    const timeElapsed = (this.endTime - this.startTime) / 1000 // Convert to seconds

    // use the vibration API to vibrate the phone for 0.1 seconds if supported
    this.vibratePhone()

    const timeFactor = 1000 / timeElapsed // Adjust as needed
    const clickFactor = 1000 * this.click // Adjust as needed
    const difficultyFactor = 1000 / parseInt(this.difficulty)
    const scoreValueFactor = 100000 / parseInt(this.pointsPerClick)

    const overallScore = Math.floor((timeFactor + clickFactor + difficultyFactor + scoreValueFactor) / 4)

    this.scoreElement.textContent = this.winScore + ' TON - WIN!'
    this.message.innerHTML = `<b>Score:</b> ${overallScore}`
  }

  /**
   * Updates the game state and renders the game on the canvas.
   *
   * @return {boolean} Returns true if the game is over, false otherwise.
   */
  game () {
    if (this.isGameActive) {
      if (this.score !== 0) {
        this.drawScore()
      }
    }

    if (this.score >= this.winScore) {
      if (this.isGameActive) {
        this.winner()
      } else {
        return true
      }
    } else if (this.score <= 0) {
      if (!this.isGameActive) this.reset()
      this.startTime = new Date().getTime()
    } else {
      this.message.innerHTML = ''
      this.score -= this.depressurissation
      this.setScore(this.score)
    }
  }
}
