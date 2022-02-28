function GeniusGame(colorTiles) {
  const state = {
    currentTileIndex: 0,
    score: 0,
    pattern: generatePattern(),
    colorTiles,
    played: false,
    level: 0,
  };

  setupOnclickListener();

  return Object.freeze({
    init: gameInit,
  });

  function enclosure(fn, ...values) {
    return () => fn(...values);
  }

  function generatePattern(limit = 0, maxNum = 4) {
    const pattern = [];

    for (let i = 0; i < 4 + Math.ceil(limit / 2); i++) {
      pattern.push(Math.floor(Math.random() * maxNum));
    }

    return pattern;
  }

  function lightColorTileOnThenOff(colorTile, timeout) {
    let offTimeout = 550 - 25 * state.level;

    setTimeout(() => {
      colorTile.classList.add("selected");
      setTimeout(() => {
        colorTile.classList.remove("selected");
      }, Math.max(offTimeout, 0));
    }, timeout - 250);
  }

  function setupOnclickListener() {
    for (let i = 0; i < state.colorTiles.length; i++) {
      const getClosuredIndex = enclosure((index) => index, i);

      colorTiles[i].addEventListener("click", ({ target }) => {
        setTimeout(() => {
          target.classList.add("selected");
          setTimeout(() => {
            target.classList.remove("selected");
            checkClickedColorTile(getClosuredIndex());
          }, 500);
        }, 0);
      });
    }
  }

  function checkClickedColorTile(clickedTileIndex) {
    if (clickedTileIndex !== state.pattern[state.currentTileIndex]) {
      state.colorTiles[clickedTileIndex].classList.add("wrong");
      alert(
        `Uh! you failed!\nfinal score: ${state.score}\nClick ok to play again`
      );
      reset();
    } else {
      state.currentTileIndex++;

      if (state.currentTileIndex >= state.pattern.length) {
        state.score += 4;

        alert(
          `OOH OOH! you've won!\nActual score: ${
            state.score
          }\nClick ok to play the next level (${state.level + 1})`
        );
        nextLevel();
      }
    }
  }

  function gameInit() {
    if (!state.played) {
      state.played = true;
      alert(
        "Welcome to the genius\nFollow the pattern of light to win!!\n\nBy ifilipe-lype"
      );
    }
    // light the color based on the pattern.
    for (let i = 0; i < state.pattern.length; i++) {
      const colorTile = state.colorTiles[state.pattern[i]];
      lightColorTileOnThenOff(colorTile, 1000 * (i + 1));
    }
  }

  function nextLevel() {
    state.level++;
    Object.assign(state, {
      pattern: generatePattern(state.level),
      currentTileIndex: 0,
      colorTiles,
    });

    for (let colorTile of state.colorTiles) {
      colorTile.classList.remove("selected");
      colorTile.classList.remove("wrong");
    }

    gameInit();
  }

  function reset() {
    // de-highlight every color-panel

    Object.assign(state, {
      score: 0,
      currentTileIndex: 0,
      level: 0,
      pattern: generatePattern(),
      colorTiles,
    });

    for (let colorTile of state.colorTiles) {
      colorTile.classList.remove("selected");
      colorTile.classList.remove("wrong");
    }

    setTimeout(gameInit, 1500);
  }
}

const colorTiles = document.querySelectorAll("#genius > *");

const genius = new GeniusGame(colorTiles);

genius.init();
