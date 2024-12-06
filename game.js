// GAME: Contagion Pandemic 2050
// Author: Your Name

// Game State Variables
let gameState = {
    infectionRate: 1, // Infection spread multiplier
    populationInfected: 0, // Total number of infected people
    funding: 100, // Funding for research and response
    vaccinesDeveloped: 0, // Number of vaccines produced
    trustLevel: 100, // Trust level among the public
    civilUnrest: 0, // Levels of civil unrest
    timeElapsed: 0, // Days since the outbreak started
};

// Constants
const GLOBAL_POPULATION = 8000000000;
const MAX_FUNDING = 500;
const MAX_UNREST = 100;

// Utility Functions
function logEvent(message) {
    const log = document.getElementById("event-log");
    const newEvent = document.createElement("p");
    newEvent.textContent = message;
    log.prepend(newEvent); // Show the latest events at the top
}

function updateUI() {
    document.getElementById("infection-rate").textContent = gameState.infectionRate.toFixed(2);
    document.getElementById("population-infected").textContent = gameState.populationInfected.toLocaleString();
    document.getElementById("funding").textContent = `$${gameState.funding}`;
    document.getElementById("vaccines-developed").textContent = gameState.vaccinesDeveloped;
    document.getElementById("trust-level").textContent = `${gameState.trustLevel}%`;
    document.getElementById("civil-unrest").textContent = `${gameState.civilUnrest}%`;
    document.getElementById("time-elapsed").textContent = `${gameState.timeElapsed} days`;
}

function randomChance(percentage) {
    return Math.random() < percentage / 100;
}

// Core Gameplay Functions
function spreadInfection() {
    const newInfections = Math.floor(gameState.populationInfected * gameState.infectionRate);
    gameState.populationInfected += newInfections;
    if (gameState.populationInfected > GLOBAL_POPULATION) {
        gameState.populationInfected = GLOBAL_POPULATION;
        logEvent("The entire global population is now infected!");
    } else {
        logEvent(`Infection spreads. ${newInfections.toLocaleString()} new people infected.`);
    }
}

function allocateFunding(amount) {
    if (gameState.funding >= amount) {
        gameState.funding -= amount;
        gameState.trustLevel += 5; // Public trusts efforts
        logEvent(`Allocated $${amount} to vaccine development.`);
    } else {
        logEvent("Not enough funding to allocate.");
    }
}

function developVaccine() {
    const success = randomChance(30 + gameState.funding / 20);
    if (success) {
        gameState.vaccinesDeveloped++;
        gameState.infectionRate *= 0.8; // Reduce infection spread
        logEvent("Vaccine successfully developed! Infection rate reduced.");
    } else {
        logEvent("Vaccine trial failed. Keep trying!");
    }
}

function handleCivilUnrest() {
    if (gameState.civilUnrest >= MAX_UNREST) {
        logEvent("Civil unrest has reached critical levels! Governments are collapsing.");
        endGame(false);
    } else if (randomChance(20)) {
        gameState.civilUnrest += 10;
        logEvent("Anti-vaccine protests escalate. Civil unrest increases.");
    }
}

function endGame(victory) {
    if (victory) {
        logEvent("Congratulations! Humanity survived the pandemic under your leadership.");
    } else {
        logEvent("Game Over: The world succumbs to chaos.");
    }
    disableGame();
}

function disableGame() {
    document.getElementById("actions").style.display = "none";
}

// Game Actions
document.getElementById("spread-infection").addEventListener("click", () => {
    spreadInfection();
    gameState.timeElapsed++;
    updateUI();
});

document.getElementById("allocate-funding").addEventListener("click", () => {
    allocateFunding(50);
    updateUI();
});

document.getElementById("develop-vaccine").addEventListener("click", () => {
    developVaccine();
    updateUI();
});

document.getElementById("civil-unrest").addEventListener("click", () => {
    handleCivilUnrest();
    updateUI();
});

// Game Loop
function gameLoop() {
    spreadInfection();
    handleCivilUnrest();
    gameState.timeElapsed++;
    updateUI();

    if (gameState.populationInfected >= GLOBAL_POPULATION / 2 && gameState.vaccinesDeveloped === 0) {
        logEvent("Warning: Half the world population is infected, but no vaccines are ready.");
    }

    if (gameState.trustLevel <= 0) {
        logEvent("Public trust collapses. You lose control over the situation.");
        endGame(false);
    }

    if (gameState.populationInfected === GLOBAL_POPULATION && gameState.vaccinesDeveloped > 0) {
        endGame(true);
    }
}

// Initialize Game
function startGame() {
    logEvent("The pandemic begins. You are Dr. Aria Chen. The world looks to you for leadership.");
    gameState.populationInfected = 1000; // Initial infection count
    updateUI();
    setInterval(gameLoop, 5000); // Game loop every 5 seconds
}

// Attach Event Listener for Start Button
document.getElementById("start-game").addEventListener("click", startGame);

// ... (previous code)

// Real-time Visualization
let mapCanvas = document.getElementById("world-map");
let mapCtx = mapCanvas.getContext("2d");

// Function to draw the infection spread on the map
function drawInfection() {
  // Simplified for demonstration: You can use a more complex algorithm for realistic spread
  let infectionRadius = Math.sqrt(gameState.populationInfected / 1000000);
  let infectionColor = `rgba(255, 0, 0, ${infectionRadius / 10})`; // Adjust opacity based on radius

  mapCtx.fillStyle = infectionColor;
  mapCtx.beginPath();
  mapCtx.arc(mapCanvas.width / 2, mapCanvas.height / 2, infectionRadius * 10, 0, 2 * Math.PI);
  mapCtx.fill();
}

// Modified game loop to include visualization
function gameLoop() {
  // ... (previous game loop code)
  drawInfection();

