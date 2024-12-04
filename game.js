// Game state and elements
let score = 0;

const storyElement = document.getElementById('story');
const choicesContainer = document.getElementById('choices');
const scoreElement = document.getElementById('score');
const virusSpread = document.getElementById('virus-spread');

// Game state to track progress
let gameState = {
  phase: 1,
  researchProgress: 0,
  containmentEfforts: 10, // Starts at 10; decreases as virus spreads
  publicTrust: 50, // Starts at 50%; affects gameplay difficulty
};

// Function to update score
function updateScore(points) {
  score += points;
  scoreElement.textContent = `Score: ${score}`;
}

// Function to update game state display (optional for more clarity)
function updateGameStateDisplay() {
  scoreElement.textContent = `Score: ${score}`;
  // Add additional game state updates here if desired
}

// Virus spread simulation
function spreadVirus() {
  // Generate random positions on the map
  const randomTop = Math.random() * 80 + '%'; // 0-80% from the top
  const randomLeft = Math.random() * 80 + '%'; // 0-80% from the left

  // Update the virus spread marker's position
  virusSpread.style.top = randomTop;
  virusSpread.style.left = randomLeft;

  // Decrease public trust and containment efforts over time
  gameState.publicTrust -= 2; // Trust drops as the virus spreads
  gameState.containmentEfforts -= 1; // Containment efforts weaken
  updateGameStateDisplay();

  // Player can click on the virus to "contain" it
  virusSpread.onclick = () => {
    updateScore(5); // Reward for containment
    gameState.containmentEfforts += 3; // Boost containment efforts
    gameState.publicTrust += 2; // Small public trust recovery
    storyElement.textContent = 'You contained a hotspot! Public trust improves slightly.';
    updateGameStateDisplay();
  };

  // Check for game over conditions
  if (gameState.containmentEfforts <= 0 || gameState.publicTrust <= 0) {
    endGame();
  }
}

// Call spreadVirus every few seconds to simulate the virus moving
setInterval(spreadVirus, 3000); // Changes position every 3 seconds

// Function to render choices
function renderChoices(choices) {
  choicesContainer.innerHTML = ''; // Clear old choices
  choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.textContent = choice.text;
    button.onclick = () => handleChoice(choice);
    choicesContainer.appendChild(button);
  });
}

// Function to handle player's choices
function handleChoice(choice) {
  updateScore(choice.points);
  storyElement.textContent = choice.resultText;

  // Adjust game state based on choice effects
  if (choice.effect) {
    for (const key in choice.effect) {
      gameState[key] += choice.effect[key];
    }
  }

  // Progress to the next phase
  if (choice.nextPhase) {
    gameState.phase++;
    nextPhase();
  }

  updateGameStateDisplay(); // Keep the display current
}

// Function to start the next phase of the game
function nextPhase() {
  switch (gameState.phase) {
    case 2:
      storyElement.textContent =
        'The virus spreads rapidly. Refugee movements complicate containment efforts. How will you respond?';
      renderChoices([
        {
          text: 'Establish Refugee Camps (+10 Trust)',
          points: 10,
          resultText: 'Refugee camps provide some stability, but resources are stretched thin.',
          effect: { publicTrust: 10 },
          nextPhase: true,
        },
        {
          text: 'Focus on Border Control (+5 Score)',
          points: 5,
          resultText: 'Border control slows the virus, but public trust declines.',
          effect: { publicTrust: -10 },
          nextPhase: true,
        },
      ]);
      break;

    case 3:
      storyElement.textContent =
        'Cyberattacks disrupt vaccine research. What will you prioritize?';
      renderChoices([
        {
          text: 'Enhance Cybersecurity (+10 Score)',
          points: 10,
          resultText: 'Your cybersecurity measures protect critical data.',
          effect: { researchProgress: 10 },
          nextPhase: true,
        },
        {
          text: 'Speed Up Research (-5 Trust)',
          points: 15,
          resultText: 'Faster research progresses but increases public mistrust.',
          effect: { publicTrust: -5, researchProgress: 15 },
          nextPhase: true,
        },
      ]);
      break;

    default:
      endGame();
  }
}

// Function to end the game
function endGame() {
  storyElement.textContent =
    'The pandemic is over. Your final score reflects the lives saved and challenges overcome.';
  choicesContainer.innerHTML = `
    <p>Final Score: ${score}</p>
    <button class="choice" onclick="restartGame()">Play Again</button>
  `;
}

// Restart the game
function restartGame() {
  location.reload();
}

// Start the game with initial choices
renderChoices([
  {
    text: 'Focus on Vaccine Research',
    points: 10,
    resultText: 'You prioritize vaccine development, but progress is slow.',
    effect: { researchProgress: 10 },
    nextPhase: true,
  },
  {
    text: 'Implement Containment Measures',
    points: 5,
    resultText: 'Containment measures buy time but strain resources.',
    effect: { containmentEfforts: 10 },
    nextPhase: true,
  },
  {
    text: 'Address Public Trust',
    points: 15,
    resultText: 'You focus on public trust, gaining support for science.',
    effect: { publicTrust: 10 },
    nextPhase: true,
  },
]);
