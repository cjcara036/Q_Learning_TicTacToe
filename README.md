<h1>Tic-Tac-Toe Game with Q-Learning AI</h1>
<p>This project is a web-based Tic-Tac-Toe game with an option to play against a Q-Learning AI agent. The AI agent uses the Q-Learning algorithm to learn and improve its strategy as it plays the game.</p>
<h2>Features</h2>
<ul>
<li>Play Tic-Tac-Toe against another player or against a Q-Learning AI agent</li>
<li>Train the AI agent by setting it to play against itself</li>
<li>Save and load the AI agent's learning progress</li>
</ul>
<h2>How to Play</h2>
<ol>
<li>Open the <code>index.html</code> file in your web browser</li>
<li>Select the game mode by clicking on the desired mode button (Player vs Player[PvP], Player vs AI[PvC], or AI vs AI[CvC])</li>
<li>Click on the desired cell on the game board to make a move</li>
<li>The game will automatically update the board and switch turns</li>
<li>The game will declare a winner or a tie if the game has ended</li>
</ol>
<h2>How to Train the AI</h2>
<ol>
<li>Set the game mode to AI vs AI[CvC]</li>
<li>The AI will play against itself for the specified number of runs</li>
<li>An alert will be posted once the AI training is done</li>
<li>The AI's learning progress can be saved and loaded using the "Save State" and "Load State" buttons</li>
</ol>
<h2>Technologies Used</h2>
<ul>
<li>HTML/CSS/JavaScript for web development</li>
<li>Q-Learning algorithm for AI training</li>
</ul>
<h2>Notes</h2>
<ul>
<li>The AI agent's learning progress is stored in the <code>QLearn_StateStore</code> variable in the <code>QLearning/script_QLearn.js</code> file. This variable can be modified and saved using the provided "Save State" and "Load State" buttons.</li>
<li>The AI agent's training can be customized by modifying the constants in the <code>TTT_processr/TTT_main.js</code> file (e.g. number of runs per training session, feedback scores for different outcomes).</li>
</ul>
