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
   * @param {HTMLInputElement} args.difficultySlider - The difficulty slider element.
   * @param {HTMLInputElement} args.scoreSizeSlider - The score slider element.
   * @param {HTMLButtonElement} args.resetButton - The reset button element.
   */
  constructor ({ app: containerClass, canvas, message, soundButton, scoreElement, difficultySlider, scoreSizeSlider, resetButton }) {
    // the app vars
    this.startTime = new Date().getTime()

    this.click = 0
    this.score = 0
    this.scoreEased = 0
    this.easedUpdateTime = 0
    this.winScore = 5.5
    this.difficulty = 5
    this.depressurissation = 0.005
    this.pointsPerClick = this.winScore / 20
    this.endTime = 0

    // sound settings
    this.soundOn = false
    this.sound = new Audio('./sounds/that-christmas.mp3')

    this.acceleration = 0.2

    // Add orientation property
    this.isGameActive = true
    this.floorPos = window.innerHeight

    // screen orientation
    this.orientation = this.isMobile() ? 'portrait' : 'landscape'

    // the container element
    this.container = containerClass

    // game elements and controls
    this.canvas = canvas
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
     * the main click event handler
     */
    this.canvas.addEventListener('click', this.clickHandler.bind(this), false)

    /**
     * The difficulty and score settings for mobiles are different
     */
    if (this.isMobile()) {
      this.pointsPerClick = this.winScore / 24
    }

    /**
     * The game loop.
     * @type {number}
     */
    this.interval = setInterval(this.game.bind(this), this.difficulty)

    /**
     * Audio control
     */
    this.soundButton.addEventListener('click', this.controlAudio.bind(this))

    document.body.addEventListener('click', this.userInteractionHandler)
    document.body.addEventListener('touchstart', this.userInteractionHandler)

    /**
     * set the orientation property based on the window size
     */
    window.addEventListener('resize', () => {
      // Update the orientation property when the window size changes
      this.orientation = this.isMobile() ? 'portrait' : 'landscape'
      this.setImageSource(this.orientation)
    })
    this.setImageSource(this.orientation)
  }

  // Add user interaction listener
  userInteractionHandler = async () => {
    await this.startAudio(true)
    document.body.removeEventListener('click', this.userInteractionHandler)
    document.body.removeEventListener('touchstart', this.userInteractionHandler)
  }

  /**
   * Controls the audio playback.
   *
   * @async
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

  /**
   * Starts the audio by playing the sound and then removes the
   * 'sound-off' class from the sound button.
   *
   * This function does not accept any parameters and does not
   * return any value.
   */
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

  /**
   * Sets the points per click based on the current score range
   * and then resets the state.
   *
   * This function does not take any parameters or return any value.
   */
  setPointsPerClick () {
    this.pointsPerClick = Number(this.scoreRange.value)
    this.reset()
  }

  /**
   * Changes the source of all images on the page based on the passed orientation.
   * It fetches the new source from the corresponding data attribute of each image.
   *
   * @param {string} orientation - The orientation of the image source to use
   */
  setImageSource (orientation) {
    // Get all images on the page
    const images = document.getElementsByTagName('img')

    // Loop through each image
    for (let i = 0; i < images.length; i++) {
      const img = images[i]

      // Get the data attribute for the passed orientation
      const newSrc = img.getAttribute(`data-${orientation}-src`)

      // If the newSrc is not null, set it as the image's src
      if (newSrc) {
        img.src = newSrc
      }
    }
  }

  /**
   * Method to check if device is mobile or in portrait mode
   *
   * @return {boolean} - True if device is mobile or in portrait mode, false otherwise.
   */
  isMobile () {
    return window.matchMedia('(max-width: 768px)').matches || window.innerHeight > window.innerWidth
  }

  /**
   * Returns the given number rounded to two decimal places.
   *
   * @param {number} num - The number to round.
   * @return {number} - The rounded number.
   */
  roundToTwo (num) {
    return Math.round(num * 100) / 100
  }

  /**
   * Resets the game state and updates the UI elements.
   *
   * @return {void}
   */
  reset () {
    this.click = 0
    this.message.innerHTML = 'Click the Pit Lift to<br/><b>START</b>'
    this.scoreElement.textContent = '0 TON'
    this.score = 0
    if (this.canStartNewGame()) {
      this.isGameActive = true
    }
  }

  /**
   * Handles the animation for a plus one interaction.
   *
   * @param {number} clickX - The x-coordinate of the click.
   * @param {number} clickY - The y-coordinate of the click.
   */
  handlePlusOneAnimation (clickX, clickY) {
    // Added properties for animation
    const pointAnimation = document.createElement('img')
    pointAnimation.className = 'animated-el click-animation'

    // Click point animation
    pointAnimation.src = 'img/click.svg'
    pointAnimation.style.position = 'absolute'
    pointAnimation.style.left = clickX + 'px'
    pointAnimation.style.top = clickY + 'px'
    pointAnimation.style.opacity = '0.75'
    pointAnimation.style.transform = 'translate(-50%, -50%) scale(0.1)' // Change this value based on how high you want it to go
    pointAnimation.style.transition = 'transform 1.5s ease-out, opacity 1s ease-in'
    pointAnimation.style.pointerEvents = 'none'

    this.container.appendChild(pointAnimation)

    new Promise(function (resolve) {
      setTimeout(() => resolve(1), 100)
    }).then(function () {
      pointAnimation.style.transform = 'translate(-50%, -50%) scale(1)'
      pointAnimation.style.opacity = '0'
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
    clickedAnimation.style.pointerEvents = 'none'

    this.container.appendChild(clickedAnimation)

    new Promise(function (resolve) {
      setTimeout(() => resolve(1), 100)
    }).then(function () {
      const shift = Math.round(Math.random() * 200) + 100
      clickedAnimation.style.transform = `translateY(-${shift}px) scale(2.5)`
      clickedAnimation.style.opacity = '0'
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
    fallingObject.style.pointerEvents = 'none'

    /**
     * Function to animate a falling object on the screen.
     * @function animate
     */
    const animate = () => {
      positionX += velocityX
      positionY += velocityY
      spin += initialSpin * 2
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
    const timeDif = currentTime - this.easedUpdateTime

    // Update the score
    if (timeDif > 20) {
      this.easedUpdateTime = currentTime
      const maxDuration = 100
      const percent = Math.min(timeDif / maxDuration, 1) // Clamp between 0 and 1

      // Use the easeOut function
      const easingAmount = this.easeOut(percent)
      this.scoreEased += (this.score - this.scoreEased) * easingAmount
      if (this.scoreEased < 0) {
        this.scoreEased = 0
      }
    }

    // Add padding to the score
    const scoreVal = this.roundToTwo(this.scoreEased).toFixed(2)
    this.scoreElement.textContent = scoreVal.padStart(5, '0') + ' TON' || '0 TON'
  }

  decreaseScore () {
    this.score -= this.depressurissation
  }

  /**
   * Sets the score value and updates the game display.
   *
   * @param {number} value - The value of the score to set.
   * @return {void}
   */
  setScore (value) {
    this.decreaseScore()

    const valuePercentile = Math.round(value / this.winScore * 100)
    const easedValuePercentile = this.easeOut(valuePercentile / 100) // Apply easing
    this.scoreEased = easedValuePercentile * this.winScore

    root.style.setProperty('--game-value', String(easedValuePercentile * 100) + '%')
    root.style.setProperty('--game-shift', String(easedValuePercentile * 100))
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
    const timeElapsed = this.endTime - this.startTime // Convert to seconds

    // use the vibration API to vibrate the phone for 0.1 seconds if supported
    this.vibratePhone()

    const timeFactor = 10000 - timeElapsed * 10
    const difficultyFactor = 1000 / parseFloat(this.difficulty)
    const scoreValueFactor = 100000 / parseFloat(this.pointsPerClick)

    const overallScore = Math.floor((timeFactor + difficultyFactor + scoreValueFactor) / 4)

    this.scoreElement.textContent = this.winScore + ' TON - WIN!'
    this.message.innerHTML = `<b>Score:</b> ${overallScore}`
  }

  /**
   * Updates the game state and renders the game on the canvas.
   *
   * @return {void} Returns true if the game is over, false otherwise.
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
      }
    } else if (this.score <= 0) {
      if (!this.isGameActive) this.reset()
      this.startTime = new Date().getTime()
    } else {
      this.message.innerHTML = ''
      this.setScore(this.score)
    }
  }
}
