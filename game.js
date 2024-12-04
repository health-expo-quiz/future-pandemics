// Initialize the game state
let score = 0;
let researchProgress = 0;
let containmentEfforts = 0;
let publicTrust = 50; // Starts at 50%

const storyElement = document.getElementById('story');
const choicesContainer = document.getElementById('choices-container');
const scoreElement = document.getElementById('score');
const virusSpread = document.getElementById('virus-spread');
const gameStats = document.getElementById('game-stats');

// Function to update the score and display it
function updateScore(points) {
  score += points;
  scoreElement.textContent = `Score: ${score}`;
}

// Function to update the public trust and display it
function updatePublicTrust(points) {
  publicTrust += points;
  publicTrust = Math.max(0, Math.min(100, publicTrust)); // Keep within 0-100%
  document.getElementById('public-trust').textContent = `Public Trust: ${publicTrust}%`;
}

// Function to render choices for the player
function renderChoices(choices) {
  choicesContainer.innerHTML = ''; // Clear previous choices
  choices.forEach(choice => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.textContent = choice.text;
    button.onclick = () => handleChoice(choice);
    choicesContainer.appendChild(button);
  });
}

// Function to handle the player's choices
function handleChoice(choice) {
  updateScore(choice.points);
  updatePublicTrust(choice.trustChange || 0);
  storyElement.textContent = choice.resultText;

  if (choice.effect) {
    // Update game state based on player's choice
    for (const key in choice.effect) {
      if (key === 'researchProgress' || key === 'containmentEfforts') {
        window[key] += choice.effect[key];
      }
    }
  }

  if (choice.nextPhase) {
    nextPhase();
  }
}

// Function to move the virus around the map (simulating its spread)
function spreadVirus() {
  const randomTop = Math.random() * 80 + '%'; // 0-80% from the top
  const randomLeft = Math.random() * 80 + '%'; // 0-80% from the left

  virusSpread.style.top = randomTop;
  virusSpread.style.left = randomLeft;
}

// Call spreadVirus every 5 seconds to simulate the virus moving
setInterval(spreadVirus, 5000); // Changes position every 5 seconds

// Function to start the next phase of the game
function nextPhase() {
  if (publicTrust <= 0) {
    endGame('Your people have lost faith in you. The virus is out of control...');
    return;
  }

  if (researchProgress >= 100) {
    endGame('You successfully developed a vaccine! The pandemic is under control!');
    return;
  }

  // Proceed through game phases based on progress
  switch (true) {
    case researchProgress < 30:
      storyElement.textContent = 'You need to ramp up vaccine research. What will you do?';
      renderChoices([
        {
          text: 'Increase funding for research (+20 Research Progress)',
          points: 10,
          trustChange: -5,
          resultText: 'You increase funding, but public trust decreases slightly.',
          effect: { researchProgress: 20 },
          nextPhase: true,
        },
        {
          text: 'Focus on containment measures (+15 Containment)',
          points: 5,
          trustChange: 0,
          resultText: 'Containment measures slow the virus, but research suffers.',
          effect: { containmentEfforts: 15 },
          nextPhase: true,
        },
      ]);
      break;

    case researchProgress < 60:
      storyElement.textContent = 'Cyberattacks threaten your research efforts. How do you respond?';
      renderChoices([
        {
          text: 'Increase cybersecurity measures (+20 Research Progress)',
          points: 15,
          trustChange: -5,
          resultText: 'Cybersecurity measures delay progress, but your data is safe.',
          effect: { researchProgress: 20 },
          nextPhase: true,
        },
        {
          text: 'Speed up research, risking attacks (-10 Public Trust)',
          points: 5,
          trustChange: -10,
          resultText: 'You rush vaccine development, but it increases public doubt.',
          effect: { researchProgress: 25 },
          nextPhase: true,
        },
      ]);
      break;

    default:
      endGame('The pandemic has ended. You either succeeded or failed...');
  }
}

// Function to end the game and show the result
function endGame(message) {
  storyElement.textContent = message;
  choicesContainer.innerHTML = `
    <p>Final Score: ${score}</p>
    <p>Public Trust: ${publicTrust}%</p>
    <button class="choice" onclick="restartGame()">Play Again</button>
  `;
}

// Restart the game
function restartGame() {
  score = 0;
  researchProgress = 0;
  containmentEfforts = 0;
  publicTrust = 50;
  scoreElement.textContent = `Score: ${score}`;
  document.getElementById('public-trust').textContent = `Public Trust: ${publicTrust}%`;
  storyElement.textContent = 'The pandemic begins... You are Dr. Aria Chen, tasked with saving the world.';
  nextPhase();
}

// Start the game
document.addEventListener('DOMContentLoaded', () => {
  storyElement.textContent = 'The pandemic begins... You are Dr. Aria Chen, tasked with saving the world.';
  nextPhase();
});
