import './index.css';
import { useState, useEffect } from 'react';
import Form from './components/Form';
import MemoryCard from './components/MemoryCard';
import GameOver from './components/GameOver';
import AssistiveTechInfo from './components/AssistiveTechInfo';

export default function App() {
  const [isGameOn, setIsGameOn] = useState(false);
  const [emojiData, setEmojiData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  useEffect(() => {
    let interval;
    if (isGameOn && !gameOver) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setTimerIntervalId(interval);
    } else if (gameOver || !isGameOn) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
    return () => clearInterval(interval);
  }, [isGameOn, gameOver]);

  useEffect(() => {
    if (matchedCards.length > 0 && matchedCards.length === emojiData.length && isGameOn) {
      setGameOver(true);
      clearInterval(timerIntervalId);
    }
  }, [matchedCards, emojiData, isGameOn, timerIntervalId]);

  async function startGame(e) {
    e.preventDefault();
    try {
      const response = await fetch('https://emojihub.yurace.pro/api/all/category/animals-and-nature');
      if (!response.ok) {
        throw new Error("Could Not Fetch Data From API");
      }
      const data = await response.json();
      const dataSlice = getDataSlice(data);
      const emojisArray = getEmojisArray(dataSlice);
      setEmojiData(emojisArray);
      setIsGameOn(true);
      setGameOver(false);
      setTimer(0);
      setScore(0);
      setSelectedCards([]);
      setMatchedCards([]);
    } catch (err) {
      console.error(err);
    }
  }

  function getEmojisArray(data) {
    const pairedEmojisArray = [...data, ...data];
    for (let i = pairedEmojisArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = pairedEmojisArray[i];
      pairedEmojisArray[i] = pairedEmojisArray[j];
      pairedEmojisArray[j] = temp;
    }
    return pairedEmojisArray;
  }

  function getDataSlice(data) {
    const randomIndices = getRandomIndices(data);
    const dataSlice = randomIndices.map((index) => data[index]);
    return dataSlice;
  }

  function getRandomIndices(data) {
    let randomIndicesArray = [];
    for (let i = 0; i < 5; i++) {
      const randomNum = Math.floor(Math.random() * data.length);
      if (!randomIndicesArray.includes(randomNum)) {
        randomIndicesArray.push(randomNum);
      } else {
        i--;
      }
    }
    return randomIndicesArray;
  }

  function turnCard(name, index) {
    if (selectedCards.length < 2 && !selectedCards.some(card => card.index === index) && !matchedCards.some(card => card.index === index)) {
      const newSelectedCards = [...selectedCards, { name, index }];
      setSelectedCards(newSelectedCards);

      if (newSelectedCards.length === 2) {
        if (newSelectedCards[0].name === newSelectedCards[1].name) {
          setMatchedCards((prevMatchedCards) => [...prevMatchedCards, ...newSelectedCards]);
          setScore((prevScore) => prevScore + 1);
          setSelectedCards([]);
        } else {
          setTimeout(() => {
            setSelectedCards([]);
          }, 1000);
        }
      }
    }
  }

  function resetGame() {
    setIsGameOn(false);
    setEmojiData([]);
    setSelectedCards([]);
    setMatchedCards([]);
    setTimer(0);
    setScore(0);
    setGameOver(false);
    clearInterval(timerIntervalId);
    setTimerIntervalId(null);
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main>
      <h1>Memory Game</h1>
      {!isGameOn && !gameOver && <Form handleSubmit={startGame} />}
      {isGameOn && !gameOver && (
        <>
          <div className="game-info-container">
            <p className="game-info-item">Time: {formatTime(timer)}</p>
            <p className="game-info-item">Score: {score}</p>
            <button className="btn btn--text" onClick={resetGame}>Reset Game</button>
          </div>
          <MemoryCard
            data={emojiData}
            handleClick={turnCard}
            selectedCards={selectedCards}
            matchedCards={matchedCards}
          />
          <AssistiveTechInfo emojisData={emojiData} matchedCards={matchedCards} />
        </>
      )}
      {gameOver && <GameOver handleClick={resetGame} finalScore={score} finalTime={formatTime(timer)} />}
    </main>
  );
}