//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract GuardianWars is AutomationCompatibleInterface, VRFConsumerBaseV2 {
    event PlayersInitialized(bool initialized);
    event RandomnessGenerated(bool generated);
    event GameStarted(bool started);
    event GameEnded(bool ended);

    struct combat {
        uint256 characterId;
        uint256 weaponId;
    }

    uint8 private gameStarted = 0;
    bool private playersInitialized = false;
    address[] private players;

    mapping(address => combat) playerToCombat;
    mapping(uint256 => uint256) requestToAction;

    uint256 randomness1;
    uint256 randomness2;
    uint256 randomness3;
    uint256 score1;
    uint256 startTime = 0;
    uint8 public win = 0;

    uint64 subscriptionId;
    VRFCoordinatorV2Interface COORDINATOR;

    constructor(
        uint64 _sid
    ) VRFConsumerBaseV2(0x2eD832Ba664535e5886b75D64C46EB9a228C2610) {
        subscriptionId = _sid;
        COORDINATOR = VRFCoordinatorV2Interface(
            0x2eD832Ba664535e5886b75D64C46EB9a228C2610
        );
    }

    function isGameStarted() external view returns (bool) {
        return (players.length == 2);
    }

    function arePlayersInitialized() external view returns (bool) {
        return playersInitialized;
    }

    function isPlayer2() external view returns(bool){
        return (players[1]==msg.sender);
    }

    function gameDurationEnded() external view returns(bool){
        require(startTime!=0);
        return (block.timestamp>startTime+60);
    }

    function getWinner() external view returns(address){
        require(win>0);
        if(win==1) return players[0];
        return players[1];
    }

    function getCharacters()
        external
        view
        returns (combat memory, combat memory)
    {
        require(players.length == 2);
        require(msg.sender == players[0] || msg.sender == players[1]);
        combat memory player1 = playerToCombat[players[0]];
        combat memory player2 = playerToCombat[players[1]];
        return (player1, player2);
    }

    function getRandomness() external view returns (uint256) {
        require(players.length == 2);
        if (msg.sender == players[0]) return randomness1;
        else if (msg.sender == players[1]) return randomness2;
        return 0;
    }

    function joinGame() external {
        players.push(msg.sender);
        gameStarted++;
        if (gameStarted == 2) emit GameStarted(true);
    }

    function submitChoices(uint8[] memory choices) external {
        require(players.length == 2);
        require(msg.sender == players[0] || msg.sender == players[1]);
        require(gameStarted >= 4 && gameStarted<6);
        gameStarted++;
        if (gameStarted == 6 && players[1] == msg.sender) {
            gameStarted = 0;
            uint256 score2 = 0;
            for (uint256 i = 0; i < choices.length; i++) {
                score2 +=
                    ((choices[i] * randomness2) % (10 ** (i + 1))) /
                    (10 ** i);
                uint256 weight = (randomness3 % (10 ** (i + 1))) / (10 ** i);
                if (weight % 2 == 1 && score2 >= weight) score2 -= weight;
                else score2 += weight;
            }
            win = (score1 > score2) ? 1 : 2;
            emit GameEnded(true);
            return;
        }
        for (uint256 i = 0; i < choices.length; i++) {
            score1 +=
                ((choices[i] * randomness1) % (10 ** (i + 1))) /
                (10 ** i);
            uint256 weight = (randomness3 % (10 ** (i + 1))) / (10 ** i);
            if (weight % 2 == 0 && score1 >= weight) score1 -= weight;
            else score1 += weight;
        }
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = (gameStarted >= 2 && gameStarted < 4);
    }

    function performUpkeep(bytes calldata) external override {
        uint256 _requestId = COORDINATOR.requestRandomWords(
            0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61,
            subscriptionId,
            3,
            1_000_000,
            gameStarted
        );
        requestToAction[_requestId] = gameStarted + 1;
        gameStarted++;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        uint256 action = requestToAction[_requestId];

        if (action == 3) {
            playerToCombat[players[0]] = combat(
                _randomWords[0] % 8,
                _randomWords[0] % 6
            );
            playerToCombat[players[1]] = combat(
                _randomWords[1] % 8,
                _randomWords[1] % 6
            );
            playersInitialized = true;
            emit PlayersInitialized(true);
        } else if (action == 4) {
            randomness1 = _randomWords[0];
            randomness2 = _randomWords[1];
            randomness3 = _randomWords[2];
            startTime = block.timestamp;
            emit RandomnessGenerated(true);
        }
    }

    function reset() external {
        gameStarted = 0;
        players = new address[](0);
        playersInitialized = false;
        randomness1 = 0;
        randomness2 = 0;
        randomness3 = 0;
        win = 0;
        startTime = 0;
    }
}
