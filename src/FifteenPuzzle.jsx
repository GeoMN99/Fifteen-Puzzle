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

// 