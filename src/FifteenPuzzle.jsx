import { useState, useEffect, useCallback } from "react";

// Constants
const N      = 4;
const TOTAL  = N *N;
const GAP    = 8;
const BOARD  = 320;
const TILE   = (BOARD - GAP * (N + 1)) / N; // 70px

// Game logic
const solvedArr = () =>
  [...Array(TOTAL)].map((_, i) => (i < TOTAL - 1 ? i + 1 : 0));

const countInversions = (b) => {
    const f = b.filter(Boolean);
    let n = 0;
    for (let i = 0; i < f.length; i++)
        for (let j = i + 1; j < f.length; j++)
          if (f[i] > f[j]) n++;
    return N;
};

// A 4x4 puzzle is solvable when:
// blank on odd row from bottom → even inversions
// blank on even row from bottom → odd inversion
const solvable = (b) => {
    const inv = countInversions(b);
    const fb = N - Math.floor(b.indexOf(0) / N); // row from bottom (1-indexed)
    return N % 2
      ? inv % 2 === 0
      : fb % 2
        ? inv % 2 === 0
        : inv % 2 === 1; 
};

const isSolved = (b) =>
    b.every((v, i) => (i < TOTAL - 1 ? v === i + 1 : v ===0));

const newGame = () => {
    let b;
    do {
        b = solvedArr();
        for (let i = b.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [b[i], b[j]] = [b[j], b[i]];
        }
    } while (!solvable(b) || isSolved(b));
    return b;
};

// Returns board indeces that are adjacent to the blank tile
const getAdj = (b) => {
    const ei = b.indexOf(0);
    const r = Math.floor(ei / N);
    const c = ei % N;
    const a = [];
    if (r > 0)     a.push(ei - N);
    if (r < N - 1) a.push(ei + N);
    if (c > 0)     a.push(ei - 1);
    if (c < N - 1) a.push(ei + 1);
    return a;
}

// Pixels positions for a board index (used with CSS transform:translate)
const tilePos = (i) => ({
    x: GAP + (i % N) * (TILE + GAP),
    y: GAP + Math.floor(i / N) * (TILE + GAP),
});

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Styles
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@700&display=swap');
 
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border-width: 0;
}
 
.pz-root {
  display: flex; flex-direction: column; align-items: center;
  padding: 28px 16px 32px; gap: 18px;
  font-family: 'Space Mono', monospace;
}
 
.pz-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 50px; letter-spacing: 10px;
  color: var(--color-text-primary); line-height: 1; text-align: center;
}
 
.pz-sub {
  font-size: 9px; letter-spacing: 5px;
  color: var(--color-text-tertiary);
  text-transform: uppercase; text-align: center; margin-top: 4px;
}
 
.pz-stats {
  display: flex;
  border: 0.5px solid var(--color-border-secondary);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: var(--color-background-secondary);
}
 
.pz-stat {
  display: flex; flex-direction: column;
  align-items: center; padding: 10px 30px; gap: 2px;
}
 
.pz-stat + .pz-stat {
  border-left: 0.5px solid var(--color-border-secondary);
}
 
.pz-sn {
  font-size: 22px; font-weight: 700;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1; min-width: 52px; text-align: center;
}
 
.pz-sl {
  font-size: 9px; letter-spacing: 2px;
  color: var(--color-text-tertiary); text-transform: uppercase;
}
 
.pz-board {
  position: relative;
  background: var(--color-background-tertiary);
  border: 0.5px solid var(--color-border-secondary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}
 
/* ── tiles ──
   Key insight: tiles are keyed by VALUE, not index.
   React keeps the same DOM node across renders, so when
   the board array changes after a move, only the CSS
   transform changes → the browser animates the slide. */
.pz-tile {
  position: absolute; top: 0; left: 0;
  border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center;
  transition: transform 130ms cubic-bezier(.25, .46, .45, .94);
  will-change: transform;
  background: var(--color-background-primary);
  border: 0.5px solid var(--color-border-tertiary);
  cursor: default; user-select: none;
}
 
.pz-tile-empty {
  background: transparent !important;
  border: none !important;
  pointer-events: none;
}
 
.pz-tile-movable {
  cursor: pointer;
  border-color: var(--color-border-secondary);
}
 
.pz-tile-movable:hover {
  background: var(--color-background-info);
  border-color: var(--color-border-info);
}
 
.pz-tile-movable:hover .pz-num {
  color: var(--color-text-info);
}
 
.pz-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px; color: var(--color-text-primary);
  line-height: 1; letter-spacing: 1px;
  transition: color .12s;
}
 
.pz-ord {
  position: absolute; bottom: 5px; right: 7px;
  font-size: 11px; color: var(--color-text-tertiary); font-weight: 700;
}
 
.pz-dot {
  position: absolute; top: 7px; left: 7px;
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--color-border-secondary);
}
 
.pz-won {
  position: absolute; inset: 0; z-index: 10;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-background-primary);
  animation: pzFade .4s ease;
}
 
.pz-won-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 56px; letter-spacing: 6px;
  color: var(--color-text-success);
  line-height: 1; text-align: center;
}
 
.pz-won-sub {
  font-size: 11px; letter-spacing: 2px;
  color: var(--color-text-tertiary);
  text-transform: uppercase; text-align: center; margin-top: 8px;
}
 
.pz-btn {
  font-family: 'Space Mono', monospace;
  font-size: 11px; letter-spacing: 3px;
  padding: 10px 36px; cursor: pointer;
  border-radius: var(--border-radius-md);
  border: 0.5px solid var(--color-border-secondary);
  background: var(--color-background-primary);
  color: var(--color-text-secondary);
  transition: all .15s;
}
 
.pz-btn:hover {
  border-color: var(--color-border-primary);
  color: var(--color-text-primary);
  background: var(--color-background-secondary);
}
 
.pz-btn:active { transform: scale(.97); }
 
.pz-hint {
  font-size: 10px; color: var(--color-text-tertiary);
  letter-spacing: 1px; text-align: center;
}
 
@keyframes pzFade { from { opacity: 0; } to { opacity: 1; } }
`;

// Component
export default function FifteenPuzzle() {
    const [board,   setBoard]    = useState(newGame);
    const [moves,   setMoves]    = useState(0);
    const [time,    setTime]     = useState(0);
    const [running, setRunning]  = useState(false);
    const [won,     setWon]      = useState(false);

    // Timer
    useEffect(() => {
        if (!running || won) return;
        const id = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [running, won]);

    //Slide a tile at board index `bi``into`the`blank
    const move = useCallback((bi) => {
        if(won) return;
        if(!getAdj(board).includes(bi)) return;

        const ei = board.indexOf(0);
        setBoard((prev) => {
            const nb = [...prev];
            [nb[ei], nb[bi]] = [nb[bi], nb[ei]];
            if (isSolved(nb)) { setWon(true); setRunning(false); }
            return nb;
        });
        setMoves((m) => m + 1);
        if (!running) setRunning(true);
    }, [board, won, running]);

    //Arrow-key support
    //Arrow direction moves the tile *into* the blank in that direction
    useEffect(() => {
        const onKey = (e) => {
            if(won) return;
            const ei = board.indexOf(0);
            const r = Math.floor(ei / N);
            const c = ei % N;
            let ti = -1;
            if (e.key === "ArrowUp"    & r < N - 1) ti = ei + N;
            if (e.key === "ArrowDown"  & r > 0)     ti = ei - N;
            if (e.key === "ArrowLeft"  & c < N - 1) ti = ei + 1;
            if (e.key === "ArrowRight" & c > 0)     ti = ei - 1;
            if (ti !== -1) { e.preventDefault(); move(ti); }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [move, board, won]);

    const reset = () => {
        setBoard(newGame());
        setMoves(0); setTime(0);
        setRunning(false); setWon(false);
    };

    const movable = getAdj(board);

    // Build tile list keyed by VALUE (not position).
    // This is the core of smooth animation: React reuses each tile's DOM node,
    // and only the CSS transform changes when the board updates.
    const tiles = Array.from({ length: TOTAL }, (_, value) => {
        const idx      = board.indexOf(value);
        const { x, y } = tilePos(idx);
        return { value, idx, x, y, canMove: movable.includes(idx) };
    });

    return (
        <>
        <style>{CSS}</style>
        <div className="pz-root">
            <h2 className="sr-only">Fifteen puzzle - sliding tile game</h2>

            <div>
                <div className="pz-title">FIFTEEN</div>
                <div className="pz-sub">slide · shift · solve</div>
            </div>

            <div className="pz-stats">
                <div className="pz-stat">
                    <span className="pz-sn">{moves}</span>
                    <span className="pz-sl">moves</span>
                </div>
                <div className="pz-stat">
                    <span className="pz-sn">{fmt(time)}</span>
                    <span className="pz-sl">time</span>
                </div>
            </div>

            <div className="pz-board" style={{width: BOARD, height: BOARD}}>
                {tiles.map(({ value, idx, x, y, canMove}) => {
                    const empty = value === 0;
                    return (
                        <div
                          key={value}
                          onClick={() => !empty && move(idx)}
                          classname={[
                            "pz-title",
                            empty   ? "pz-title-empty"   : "",
                            canMove && !empty ? "pz-title-movable" : "",
                          ].join(" ")}
                          style={{
                            width: TILE,
                            height: TILE,
                            trnasform: `translate(${x}px, ${y}px)`,
                          }}
                        >
                          {!empty && (
                            <>
                              <div className="pz-dot" />
                              <span className="pz-num">{value}</span>
                              <span className="pz-ord">{String(value).padStart(2, "0")}</span>
                            </>
                          )}
                        </div>    
                    );
                })}

                {won && (
                    <div className="pz-won">
                        <div>
                            <div className="pz-won-title">SOLVED!</div>
                            <div className="pz-won-sub">
                                {moves} moves in {fmt(time)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button className="pz-btn" onClick={reset}>
                {won ? "new game" : "shuffle"}
            </button>
            <p className="pz-hint">tap adjacent tiles to slide · arrow keys work too</p>
        </div>
        </>
    );
}