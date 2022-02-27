function GeniusGame() {
  const state = {
    currentTileIndex: 0,
    score: 0,
    pattern: generatePattern(),
    colorTiles,
  };

  return Object.freeze({
    init: gameInit,
    gameOver: () => {},
    restart: reset,
  });

  function enclosure(fn, ...values) {
    return () => fn(...values);
  }

  function generatePattern(limit = 6, maxNum = 4) {
    const pattern = [];

    for (let i = 0; i < limit; i++) {
      pattern.push(Math.floor(Math.random() * maxNum));
    }

    return pattern;
  }

  function lightColorTileOnThenOff(colorTile, timeout) {
    setTimeout(() => {
      colorTile.classList.add("selected");

      setTimeout(() => {
        colorTile.classList.remove("selected");
      }, 500);
    }, timeout || 0);
  }

  function setupOnclickListener() {
    for (let i = 0; i < state.colorTiles.length; i++) {
      const getClosuredIndex = enclosure((index) => index, i);

      colorTiles[i].addEventListener("click", ({ target }) => {
        lightColorTileOnThenOff(target);
        checkClickedColorTile(getClosuredIndex());
      });
    }

    function checkClickedColorTile(clickedTileIndex) {
      if (clickedTileIndex !== state.pattern[state.currentTileIndex]) {
        state.colorTiles[clickedTileIndex].classList.add("wrong");
        alert(`Uh! you failled! final score: ${state.score}`);
        reset();
      } else {
        state.score++;
        state.currentTileIndex++;

        if (state.currentTileIndex >= state.pattern.length) {
          alert(`Uh! you've won! final score: ${state.score}`);
          reset();
        }
      }
    }
  }

  function gameInit() {
    showColorTilesPattern();
    setupOnclickListener();
    // check user's click event on panels

    function showColorTilesPattern() {
      // light the color based on the pattern.
      for (let i = 0; i < state.pattern.length; ) {
        const colorTile = state.colorTiles[state.pattern[i]];
        lightColorTileOnThenOff(colorTile, 1000 * i++);
      }
    }
  }

  function reset() {
    // de-highlight every color-panel

    Object.assign(state, {
      score: 0,
      currentTileIndex: 0,
      pattern: generatePattern(),
    });

    for (let colorTile of state.colorTiles) {
      colorTile.classList.remove("selected");
      colorTile.classList.remove("wrong");
    }

    gameInit();
  }
}

const colorTiles = document.querySelectorAll("#genius > *");

const genius = new GeniusGame(colorTiles);

genius.init();
