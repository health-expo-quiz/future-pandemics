// game.js
const storyElement = document.getElementById('story');
const container = document.getElementById('game-container');

// Game state
let choices = {
  research: false,
  containment: false,
  media: false,
};

// Story progression
function makeChoice(choice) {
  choices[choice] = true;

  switch (choice) {
    case 'research':
      storyElement.textContent = 'You focus on vaccine research. However, a cyber attack on the main facility sets you back by weeks. What will you do next?';
      renderChoices(['Enhance Cybersecurity', 'Collaborate with Other Labs']);
      break;
    case 'containment':
      storyElement.textContent = 'You implement containment measures, but climate refugees complicate the efforts. What will you do next?';
      renderChoices(['Set Up Refugee Camps', 'Focus on Border Control']);
      break;
    case 'media':
      storyElement.textContent = 'You address the anti-science movement, but they start organizing violent protests. What will you do next?';
      renderChoices(['Engage in Dialogue', 'Deploy Police Forces']);
      break;
    default:
      endGame();
  }
}

// Render new choices
function renderChoices(options) {
  container.innerHTML = `
    <h1>Pandemic 2050</h1>
    <p id="story">${storyElement.textContent}</p>
  `;

  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.textContent = option;
    button.onclick = () => resolveChoice(index);
    container.appendChild(button);
  });
}

// Resolve subsequent choices
function resolveChoice(index) {
  if (index === 0) {
    storyElement.textContent = 'Your actions have stabilized the situation for now, but new challenges arise. Stay vigilant.';
  } else if (index === 1) {
    storyElement.textContent = 'Tensions escalate, and you must make tough decisions. Humanity hangs in the balance.';
  }

  renderChoices(['Restart Game']);
}

// End the game
function endGame() {
  container.innerHTML = `
    <h1>Game Over</h1>
    <p>Your decisions have led to unforeseen consequences. Try again!</p>
    <button class="choice" onclick="restartGame()">Restart</button>
  `;
}

// Restart the game
function restartGame() {
  window.location.reload();
}
