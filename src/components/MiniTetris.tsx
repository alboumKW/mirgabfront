'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// Game constants
const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 12;
const EMPTY_CELL = 0;

// Tetris pieces (simplified - just 4 pieces)
const PIECES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'bg-cyan-400'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-yellow-400'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'bg-purple-400'
  },
  L: {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    color: 'bg-orange-400'
  }
};

const PIECE_TYPES = Object.keys(PIECES) as Array<keyof typeof PIECES>;

type Board = number[][];
type Position = { x: number; y: number };
type Piece = {
  shape: number[][];
  color: string;
  position: Position;
};

// Create empty board
const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL));
};

// Generate random piece
const generatePiece = (): Piece => {
  const pieceType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  const piece = PIECES[pieceType];
  return {
    shape: piece.shape,
    color: piece.color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
  };
};

// Check if piece can be placed at position
const canPlacePiece = (board: Board, piece: Piece, position: Position): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (
          newX < 0 || 
          newX >= BOARD_WIDTH || 
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

// Place piece on board
const placePiece = (board: Board, piece: Piece): Board => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = 1;
        }
      }
    }
  }
  
  return newBoard;
};

// Clear completed lines
const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const newBoard = board.filter(row => row.some(cell => cell === EMPTY_CELL));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  // Add new empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
  }
  
  return { newBoard, linesCleared };
};

export default function MiniTetris() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece>(generatePiece);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Move piece down
  const moveDown = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    const newPosition = { ...currentPiece.position, y: currentPiece.position.y + 1 };
    
    if (canPlacePiece(board, currentPiece, newPosition)) {
      setCurrentPiece(prev => ({ ...prev, position: newPosition }));
    } else {
      // Place piece and generate new one
      const newBoard = placePiece(board, currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setScore(prev => prev + linesCleared * 100 + 10);
      
      const nextPiece = generatePiece();
      if (!canPlacePiece(clearedBoard, nextPiece, nextPiece.position)) {
        setGameOver(true);
      } else {
        setCurrentPiece(nextPiece);
      }
    }
  }, [board, currentPiece, gameOver, isPaused, gameStarted]);

  // Move piece left/right
  const movePiece = useCallback((direction: 'left' | 'right') => {
    if (gameOver || isPaused || !gameStarted) return;

    const dx = direction === 'left' ? -1 : 1;
    const newPosition = { ...currentPiece.position, x: currentPiece.position.x + dx };
    
    if (canPlacePiece(board, currentPiece, newPosition)) {
      setCurrentPiece(prev => ({ ...prev, position: newPosition }));
    }
  }, [board, currentPiece, gameOver, isPaused, gameStarted]);

  // Drop piece instantly
  const dropPiece = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    let newY = currentPiece.position.y;
    while (canPlacePiece(board, currentPiece, { ...currentPiece.position, y: newY + 1 })) {
      newY++;
    }
    setCurrentPiece(prev => ({ ...prev, position: { ...prev.position, y: newY } }));
  }, [board, currentPiece, gameOver, isPaused, gameStarted]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(isRTL ? 'right' : 'left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(isRTL ? 'left' : 'right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case ' ':
          e.preventDefault();
          dropPiece();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }
    };

    if (gameStarted) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [movePiece, moveDown, dropPiece, gameStarted, isRTL]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const interval = setInterval(moveDown, 800);
    return () => clearInterval(interval);
  }, [moveDown, gameStarted, gameOver, isPaused]);

  // Start game
  const startGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(generatePiece());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
  };

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (!gameOver && gameStarted) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 2; // Current piece marker
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`
              w-5 h-5 sm:w-6 sm:h-6 border border-gray-600 
              ${cell === 1 ? 'bg-blue-400 pixel-glow' : ''}
              ${cell === 2 ? `${currentPiece.color} pixel-glow` : ''}
              ${cell === 0 ? 'bg-gray-900/50' : ''}
            `}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 pixel-border-subtle max-w-full">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 font-display">
        {t('tetris')}
      </h3>
      
      <div className={`flex flex-col lg:flex-row gap-4 sm:gap-6 items-center lg:items-start w-full max-w-4xl ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
        {/* Game Board */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="mb-3">
            <div className="text-white text-sm font-medium text-center">
              {t('score')}: <span className="text-cyan-400 font-bold">{score}</span>
            </div>
          </div>
          
          <div className="border-2 border-white/30 rounded-lg p-1 sm:p-2 bg-black/30">
            {renderBoard()}
          </div>
        </div>

        {/* Controls */}
        <div className={`flex flex-col gap-3 sm:gap-4 text-white text-sm w-full lg:w-auto lg:min-w-[200px] ${isRTL ? 'text-right' : 'text-left'}`}>
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 pixel-border hover:pixel-glow font-display"
            >
              {t('startGame')}
            </button>
          ) : (
            <>
              {gameOver && (
                <div className="text-center">
                  <div className="text-red-400 font-bold mb-2">{t('gameOver')}</div>
                  <button
                    onClick={startGame}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 pixel-border hover:pixel-glow"
                  >
                    {t('playAgain')}
                  </button>
                </div>
              )}
              
              {isPaused && !gameOver && (
                <div className="text-yellow-400 font-bold text-center">{t('paused')}</div>
              )}
              
              <div className="space-y-1 sm:space-y-2 bg-black/20 p-3 rounded-lg">
                <div className={`font-medium text-cyan-400 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>{t('controls')}:</div>
                <div className={`text-xs sm:text-sm grid grid-cols-2 gap-1 sm:block sm:space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div>{isRTL ? '→ ←' : '← →'} {t('move')}</div>
                  <div>↓ {t('softDrop')}</div>
                  <div>Space: {t('hardDrop')}</div>
                  <div>P: {t('pause')}</div>
                </div>
              </div>
              
              <button
                onClick={() => setIsPaused(prev => !prev)}
                disabled={gameOver}
                className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300 pixel-border hover:pixel-glow"
              >
                {isPaused ? t('resume') : t('pause')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Controls */}
      {gameStarted && (
        <div className="lg:hidden mt-4 w-full max-w-sm">
          <div className="text-center text-gray-400 text-xs mb-2">{t('touchControls')}:</div>
          <div className={`grid grid-cols-4 gap-2 ${isRTL ? 'direction-rtl' : ''}`}>
            {isRTL ? (
              <>
                <button
                  onClick={() => movePiece('right')}
                  disabled={gameOver}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold"
                >
                  →
                </button>
                <button
                  onClick={moveDown}
                  disabled={gameOver}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold"
                >
                  ↓
                </button>
                <button
                  onClick={() => movePiece('left')}
                  disabled={gameOver}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold"
                >
                  ←
                </button>
                <button
                  onClick={dropPiece}
                  disabled={gameOver}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold text-xs"
                >
                  {t('dropButton')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => movePiece('left')}
                  disabled={gameOver}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold"
                >
                  ←
                </button>
                <button
                  onClick={moveDown}
                  disabled={gameOver}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold"
                >
                  ↓
                </button>
                <button
                  onClick={() => movePiece('right')}
                  disabled={gameOver}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold"
                >
                  →
                </button>
                <button
                  onClick={dropPiece}
                  disabled={gameOver}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg pixel-border font-bold text-xs"
                >
                  {t('dropButton')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-gray-400 text-xs">
        {t('tetrisTagline')}
      </div>
    </div>
  );
}
