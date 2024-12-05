// Initialize game state
let score = 0;
const gameState = {
  phase: 1,
  publicTrust: 50, // Starts at 50%
  virusSpreadRate: 1, // Affects how fast the virus spreads
  containmentEfforts: 0,
  vaccineResearch: 0,
};

// Get references to DOM elements
const storyElement = document.getElementById("story");
const choicesContainer = document.getElementById("choices");
const scoreElement = document.getElementById("score");
const virusSpread = document.getElementById("virus-spread");

// Update score display
function updateScore(points) {
  score += points;
  scoreElement.textContent = `Score: ${score}`;
}

// Handle virus spread animation
function spreadVirus() {
  const randomTop = Math.random() * 90 + "%";
  const randomLeft = Math.random() * 90 + "%";

  virusSpread.style.top = randomTop;
  virusSpread.style.left = randomLeft;

  // Increase spread rate if public trust is low
  if (gameState.publicTrust < 30) {
    gameState.virusSpreadRate += 0.5;
  }
}

// Render the story and choices for each phase
function renderPhase() {
  choicesContainer.innerHTML = ""; // Clear old choices

  switch (gameState.phase) {
    case 1:
      storyElement.textContent =
        "A mysterious virus has emerged from the Siberian permafrost. How will you respond?";
      renderChoices([
        {
          text: "Focus on public trust",
          points: 10,
          resultText:
            "Your efforts to communicate with the public improve trust, but the virus continues to spread.",
          effect: { publicTrust: 10 },
          nextPhase: true,
        },
        {
          text: "Implement containment measures",
          points: 15,
          resultText:
            "Containment measures slow the virus but reduce public freedom.",
          effect: { containmentEfforts: 10, publicTrust: -5 },
          nextPhase: true,
        },
        {
          text: "Prioritize vaccine research",
          points: 20,
          resultText:
            "Early vaccine research begins, but it will take time to develop.",
          effect: { vaccineResearch: 10 },
          nextPhase: true,
        },
      ]);
      break;

    case 2:
      storyElement.textContent =
        "The virus spreads rapidly. Refugee movements complicate containment efforts. What will you do?";
      renderChoices([
        {
          text: "Set up refugee camps",
          points: 15,
          resultText:
            "Refugee camps stabilize the situation but stretch resources.",
          effect: { publicTrust: 10 },
          nextPhase: true,
        },
        {
          text: "Focus on border control",
          points: 10,
          resultText:
            "Border control slows the virus but decreases global cooperation.",
          effect: { containmentEfforts: 10, publicTrust: -10 },
          nextPhase: true,
        },
      ]);
      break;

    case 3:
      storyElement.textContent =
        "Cyberattacks threaten vaccine research. How will you respond?";
      renderChoices([
        {
          text: "Strengthen cybersecurity",
          points: 20,
          resultText:
            "Your cybersecurity measures protect critical vaccine research.",
          effect: { vaccineResearch: 10 },
          nextPhase: true,
        },
        {
          text: "Accelerate vaccine production",
          points: 25,
          resultText:
            "Accelerating production leads to a faster vaccine but public trust declines.",
          effect: { publicTrust: -10, vaccineResearch: 20 },
          nextPhase: true,
        },
      ]);
      break;

    default:
      endGame();
  }
}

// Render choice buttons dynamically
function renderChoices(choices) {
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = choice.text;
    button.onclick = () => handleChoice(choice);
    choicesContainer.appendChild(button);
  });
}

// Handle choice selection
function handleChoice(choice) {
  updateScore(choice.points);
  storyElement.textContent = choice.resultText;

  // Apply choice effects to game state
  for (const key in choice.effect) {
    gameState[key] += choice.effect[key];
  }

  // Move to the next phase
  if (choice.nextPhase) {
    gameState.phase++;
    renderPhase();
  }
}

// End the game
function endGame() {
  storyElement.textContent =
    "The pandemic has been resolved. Here is your final score:";
  choicesContainer.innerHTML = `
    <p>Final Score: ${score}</p>
    <button class="choice" onclick="restartGame()">Play Again</button>
  `;
}

// Restart the game
function restartGame() {
  location.reload();
}

// Virus movement simulation
setInterval(spreadVirus, 3000); // Virus marker moves every 3 seconds

// Start the game
renderPhase();
