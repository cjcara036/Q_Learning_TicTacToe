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
<h2>About the QLearn class</h2>
<p>The QLearn class is a JavaScript implementation of the Q-Learning algorithm. It is used to train the AI agent in this Tic-Tac-Toe game project. The QLearn class has the following methods:</p>
<ul>
<li><code>chooseState(SName, StateAction, addtoShiftChain=true)</code>: This method chooses an action from the <code>StateAction</code> list, given a state represented by <code>SName</code>. If <code>addtoShiftChain</code> is set to true, the chosen action will also be added to the QLearn object's state chain. The chosen action is selected based on the probabilities stored in the <code>QLearn_StateStore</code> global variable, which is a matrix of state-action pairs and their corresponding probabilities.</li>
<li><code>feedback(StateChain_Score)</code>: This method updates the probabilities in the <code>QLearn_StateStore</code> based on the feedback score provided in <code>StateChain_Score</code>. The feedback score is used to adjust the probabilities of the actions in the QLearn object's state chain in proportion to their relative distance from the end of the chain. The probabilities are also normalized after being updated.</li>
<li><code>addtoStateChain(stateName, ActList, ActionSelected)</code>: This method adds an entry to the QLearn object's state chain, consisting of the state represented by <code>stateName</code> and the action represented by <code>ActionSelected</code>. If the state represented by <code>stateName</code> does not exist in the <code>QLearn_StateStore</code>, it is added to the <code>QLearn_StateStore</code> with equal probabilities for all actions in <code>ActList</code>.</li>
<li><code>clearStateChain()</code>: This method clears the QLearn object's state chain.</li>
</ul>
