// GameBoard.js
import React, { useState, useEffect } from 'react';

import './snaky.css';

export default function GameBoard() {
  let totalGridSize = 20;
  let xPos = Math.floor(Math.random() * totalGridSize);
  let yPos = Math.floor(Math.random() * totalGridSize);
  const initialSnakePos = [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ];
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState(initialSnakePos);
  const [direction, setDirection] = useState('RIGHT');

  function renderBoard() {
    let cellArray = [];
    for (let row = 0; row < totalGridSize; row++) {
      for (let col = 0; col < totalGridSize; col++) {
        let classAdd = 'cell';
        let isFood = food.x === row && food.y === col;
        let isSnake = snake.some((el) => el.x === row && el.y === col);
        let isSnakeHead = snake[0].x === row && snake[0].y === col;

        if (isFood) {
          classAdd += ' food';
        }
        if (isSnakeHead) {
          classAdd += ' snake-head';
        }
        if (isSnake) {
          classAdd += ' snake';
        }
        let cell = <div className={classAdd} key={`${row}-${col}`}></div>;
        cellArray.push(cell);
      }
    }
    return cellArray;
  }
  function gameOver() {
    setSnake(initialSnakePos);
    renderFood();
    setDirection('RIGHT');
    setScore(0);
  }
  function updateGame() {
    if (
      snake[0].x < 0 ||
      snake[0].x > 20 ||
      snake[0].y < 0 ||
      snake[0].y > 20
    ) {
      gameOver();
      return;
    }
    let selfBite = snake
      .slice(1)
      .some((ele) => ele.x === snake[0].x && ele.y === snake[0].y);
    if (selfBite) {
      gameOver();
      return;
    }
    let newSnake = [...snake];
    switch (direction) {
      case 'RIGHT':
        newSnake.unshift({ newSnake, x: newSnake[0].x, y: newSnake[0].y + 1 });
        break;
      case 'LEFT':
        newSnake.unshift({ newSnake, x: newSnake[0].x, y: newSnake[0].y - 1 });
        break;
      case 'UP':
        newSnake.unshift({ newSnake, x: newSnake[0].x - 1, y: newSnake[0].y });
        break;
      case 'DOWN':
        newSnake.unshift({ newSnake, x: newSnake[0].x + 1, y: newSnake[0].y });
        break;
      default:
        break;
    }

    let foodAte = newSnake[0].x === food.x && newSnake[0].y === food.y;
    if (foodAte) {
      setScore((prev) => prev + 1);
      renderFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }
  function renderFood() {
    setFood({ x: xPos, y: yPos });
  }
  useEffect(() => {
    const handleKeyPress = (e) => {
      let code = e.code;
      switch (code) {
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    let interval = setInterval(updateGame, 200);
    return () => clearInterval(interval, updateGame);
  });

  return (
    <div className="container">
      <h1>Snaky The Game</h1>
      <h3 className="score">Score: {score}</h3>
      <div className="gameBoard">{renderBoard()}</div>
    </div>
  );
}
