    let strapDiv = document.getElementById('strapDiv');
    let windowHeight = window.innerHeight;
    // generate watch strap
    for (let i = -43; i <= windowHeight; i += 43) {
      const strap = document.createElement('div');
      strap.classList.add('strap');
      strap.style.top = `${i + 'px'}`;
      strapDiv.appendChild(strap);
    }
    
    const gameFields = [
      { label: 'Half Length', value: 45, type: 'number' },
      { label: 'Halftime Length', value: 15, type: 'number' },
      { label: 'Substitution Limit', value: 5, type: 'number' },
      { label: 'Enable Overtime', value: true, type: 'boolean' },
      { label: 'Overtime Length', value: 15, type: 'number' },
    ];

    const teamFields = [
      { label: 'Team 1 Abbrev', value: ['T', 'M', '1'], type: 'abbrev', charIndex: 0 },
      { label: 'Team 2 Abbrev', value: ['T', 'M', '2'], type: 'abbrev', charIndex: 0 },
      { label: 'Team 1 Color', value: 'Red', type: 'color' },
      { label: 'Team 2 Color', value: 'Blue', type: 'color' }
    ];

    const timerEndAlarm = new Audio('watch-timer-alarm.mp3');
    let sectionEnd = false;
    function endSection() {
      sectionEnd = true;
      timerEndAlarm.play();
    }
    
    const sectionInfo = [
      { name: '1st Half', minutes: gameFields[0].value},
      { name: 'Halftime', minutes: gameFields[1].value},
      { name: '2nd Half', minutes: gameFields[0].value},
      { name: '1st Overtime', minutes: gameFields[4].value},
      { name: '2nd Overtime', minutes: gameFields[4].value},
      { name: 'Game Summary', minutes: 0}
    ];
    sectionIndex = 0
    
    const cardReports = [];
    const cardReasons = ['RFOUL', 'DGPLY', 'DOGSO', 'UNBHV', 'VIOLC', 'CFOUL', 'DELAY', 'TRICK', 'XCELB', 'HANDG', '2CARD', 'OTHER'];
    
    let cardFields = [
      { label: 'Card Color', value: 'Yellow', type: 'colorOption' },
      { label: 'Team', value: teamFields[0].value.join(''), type: 'teamName' },
      { label: 'Player Number', value: 10, type: 'number' },
      { label: 'Reason', value: cardReasons[0], type: 'reason' }
    ];


    const colorOptions = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple'];
    const charOptions = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

    let mode = 'Game Setup';
    let selectedIndex = 0;
    let isEditMode = false;
    let justEnteredEditMode = false;
    let holdTimeout;

    const fieldsDiv = document.getElementById('fields');
    const editIndicator = document.getElementById('editIndicator');
    const modeHeader = document.getElementById('mode');
    updateMode();

    let timeRemaining = 0;
    let gameTimer = null;
    
    const teamStats = {
        team1: { goals: 0, subs: 0 },
        team2: { goals: 0, subs: 0 }
    };
   
    let pendingAdjustment = null;
    const statsDiv = document.createElement('div');
    statsDiv.classList.add('stats');

    function getCurrentFields() {
      return mode === 'Game Setup' ? gameFields : teamFields;
    }

    function renderFields() {
      if (mode === 'Game') { // Proceed to appropriate game section
        sectionInfo[0].minutes = gameFields[0].value;
        sectionInfo[1].minutes = gameFields[1].value;
        sectionInfo[2].minutes = gameFields[0].value;
        sectionInfo[3].minutes = gameFields[4].value;
        sectionInfo[4].minutes = gameFields[4].value;
        
        nextSection(sectionInfo[sectionIndex].name,
        sectionInfo[sectionIndex].minutes);
        return; // exit renderFields()
      }
      if (mode === 'Card Reporting') {
        gameTimer.pause();
        fieldsDiv.innerHTML = '';
        
        cardFields.forEach((field, index) => { // Display card fields
        const div = document.createElement('div');
          div.className = 'field';
          const flashClass = (index === selectedIndex) ? 'flash' : '';
          div.innerHTML = `${field.label}: <span class="field-value ${flashClass}">${field.value}</span>`;
          fieldsDiv.appendChild(div);
        });
        return; // exit renderFields()
      }
      // If mode is Game Setup or Team Setup
      const fields = getCurrentFields();
      fieldsDiv.innerHTML = '';
      fields.forEach((field, index) => { // Generate appropriate list of fields
        const div = document.createElement('div');
        div.className = 'field';
        if (isEditMode && index === selectedIndex) { // Value being edited should flash
          div.classList.add('flash');
        }
        let valueDisplay = '';
        if (field.type === 'abbrev') { // Special case for team abbreviations
          valueDisplay = field.value.map((char, charIdx) => {
            const isSelectedChar = isEditMode &&
            index === selectedIndex && field.charIndex === charIdx;
            return `<span class="field-char${isSelectedChar ?
            ' flash' : ''}">${char}</span>`;
          }).join('');
        } else {
          valueDisplay = field.value;
        }
        
        if (field.type === 'abbrev') { // Special case for team abbreviations
          div.innerHTML = `${field.label}: ${valueDisplay}`;
        } else {
          div.innerHTML = `${field.label}: 
          <span class="field-value${isEditMode && index === selectedIndex ?
          ' flash' : ''}">${valueDisplay}</span>`;
        }
        fieldsDiv.appendChild(div); 
      });
      
      if (isEditMode) { // edit indicator
        editIndicator.style.visibility = 'visible';
      } else {
        editIndicator.style.visibility = 'hidden';
      }
    }

    function increaseValue() {
      if (mode === 'Card Reporting') { // Special case for Card Reporting mode
        const field = cardFields[selectedIndex];
        switch (field.type) {
          case 'colorOption':
            field.value = field.value === 'Yellow' ? 'Red' : 'Yellow';
            break;
          case 'teamName':
            field.value = field.value === teamFields[0].value.join('') ?
            teamFields[1].value.join('') : teamFields[0].value.join('');
            break;
          case 'number':
            if (field.value < 99) field.value++;
            break;
          case 'reason':
            let idx = cardReasons.indexOf(field.value);
            field.value = cardReasons[(idx + 1) % cardReasons.length];
            break;
        }
        renderFields();
        return; // exit increaseValue()
      }
      
      // Normal behavior in Game Setup and Team Setup
      const field = getCurrentFields()[selectedIndex];
      switch (field.type) {
        case 'number':
          if (field.value < 99) field.value++;
          break;
        case 'boolean':
          field.value = !field.value;
          break;
        case 'color':
          const colorIdx = colorOptions.indexOf(field.value);
          field.value = colorOptions[(colorIdx + 1) % colorOptions.length];
          break;
        case 'abbrev':
          const i = field.charIndex;
          const currentChar = field.value[i];
          const charIdx = charOptions.indexOf(currentChar);
          field.value[i] = charOptions[(charIdx + 1) % charOptions.length];
          break;
      }
      renderFields();
    }

    function decreaseValue() {
    // Another special case for Card Reporting mode (is it obvious I added it last?)
      if (mode === 'Card Reporting') {
        const field = cardFields[selectedIndex];
        switch (field.type) {
          case 'colorOption':
            field.value = field.value === 'Yellow' ? 'Red' : 'Yellow';
            break;
          case 'teamName':
            field.value = field.value === teamFields[0].value.join('') ?
            teamFields[1].value.join('') : teamFields[0].value.join('');
            break;
          case 'number':
            if (field.value > 0) field.value--;
            break;
          case 'reason':
            let idx = cardReasons.indexOf(field.value);
            field.value = cardReasons[(idx - 1 + cardReasons.length) %
            cardReasons.length];
            break;
        }
        renderFields();
        return; // exit decreaseValue()
      }

      // Normal behavior in Game Setup and Team Setup
      const field = getCurrentFields()[selectedIndex];
      switch (field.type) {
        case 'number':
          if (field.value > 1) {
            field.value--;
          }
          break;
        case 'boolean':
          field.value = !field.value;
          break;
        case 'color':
          const colorIdx = colorOptions.indexOf(field.value);
          field.value = colorOptions[(colorIdx - 1 + colorOptions.length) %
          colorOptions.length];
          break;
        case 'abbrev':
          const i = field.charIndex;
          const currentChar = field.value[i];
          const charIdx = charOptions.indexOf(currentChar);
          field.value[i] = charOptions[(charIdx - 1 + charOptions.length) %
          charOptions.length];
          break;
      }
      renderFields();
    }

    function nextSelection() {
      const fields = getCurrentFields();
      const field = fields[selectedIndex];
      if (field.type === 'abbrev') {
        field.charIndex += 1;
        if (field.charIndex >= field.value.length) {
          field.charIndex = 0;
          selectedIndex = (selectedIndex + 1) % fields.length;
        }
      } else {
        selectedIndex = (selectedIndex + 1) % fields.length;
      }

      renderFields();
    }

    function updateMode() {
      if (mode !== 'Game') {
        modeHeader.innerText = mode;
      }
      if (mode === 'Card Reporting') { // Another exception for Card Reporting :/
        cardFields[1].value = teamFields[0].value.join('');
      }
      selectedIndex = 0;
      renderFields();
    }

    // Button logic
    
    // Button A hold logic
    document.getElementById('btnA').addEventListener('mousedown', () => {
      if (mode === 'Game Setup' || mode === 'Team Setup') {
        holdTimeout = setTimeout(() => {
          isEditMode = !isEditMode;
          justEnteredEditMode = isEditMode; // Only true when entering edit mode
          renderFields();
        }, 700);
      }
    });

    document.getElementById('btnA').addEventListener('mouseup', () => {
      switch (mode) {
        case 'Game Setup':
          clearTimeout(holdTimeout); // Cancel action because A wasn't held for long enough
          if (isEditMode && !justEnteredEditMode) {
            nextSelection();
          }
          justEnteredEditMode = false;
          break;
        case 'Team Setup':
          clearTimeout(holdTimeout); // Cancel action because A wasn't held for long enough
          if (isEditMode && !justEnteredEditMode) {
            nextSelection();
          }
          justEnteredEditMode = false;
          break;
        case 'Game':
          if (pendingAdjustment) { // Alter Team 1's goals
            applyStatChange(1, 'goals', pendingAdjustment === 'increase' ? 1 : -1);
            pendingAdjustment = null;
          }
          break;
        case 'Card Reporting':
          selectedIndex = (selectedIndex + 1) % cardFields.length; // Change field being edited
          renderFields();
          break;
        case 'Game Summary':
          break;
        default:
          console.log('invalid mode')
          break;
      }
    });

    document.getElementById('btnB').addEventListener('click', () => {
      switch (mode) {
        case 'Game Setup':
          if (isEditMode) {
            increaseValue();
          }
          break;
        case 'Team Setup':
          if (isEditMode) {
            increaseValue();
          }
          break;
        case 'Game':
          if (!pendingAdjustment) {
            pendingAdjustment = 'increase'
          } else { // Alter Team 2's goals
            applyStatChange(2, 'goals', pendingAdjustment === 'increase' ? 1 : -1);
            pendingAdjustment = null;
          }
          break;
        case 'Card Reporting':
          increaseValue();
          break;
        case 'Game Summary':
          break;
        default:
          console.log('invalid mode')
          break;
      }
    });

    document.getElementById('btnD').addEventListener('click', () => {
      switch (mode) {
        case 'Game Setup':
          if (isEditMode) {
            decreaseValue();
          }
          break;
        case 'Team Setup':
          if (isEditMode) {
            decreaseValue();
          }
          break;
        case 'Game':
          if (!pendingAdjustment) {
            pendingAdjustment = 'decrease'
          } else { // Alter Team 2's subs
            applyStatChange(2, 'subs', pendingAdjustment === 'increase' ? 1 : -1);
            pendingAdjustment = null;
          }
          break;
        case 'Card Reporting':
          decreaseValue();
          break;
        case 'Game Summary':
          break;
        default:
          console.log('invalid mode')
          break;
      }
    });

    document.getElementById('btnC').addEventListener('click', () => {
      switch (mode) {
        case 'Team Setup':
          if (!isEditMode) { // Change mode to Game Setup
            mode = 'Game Setup';
            updateMode();
          }
          break;
        case 'Game Setup':
          break;
        case 'Game':
          if (pendingAdjustment) { // Alter Team 1's subs
            applyStatChange(1, 'subs', pendingAdjustment === 'increase' ? 1 : -1);
            pendingAdjustment = null;
          } else { // Enter Card Reporting
            mode = 'Card Reporting';
            selectedIndex = 0;
            isEditMode = true;
            updateMode();
          }
          break;
        case 'Card Reporting': // Cancel Card Reporting
          mode = 'Game';
          renderGameScreen();
          break;
        case 'Game Summary':
          break;
        default:
          console.log('invalid mode')
          break;
       }
    });
    
    // Button E hold logic
    document.getElementById('btnE').addEventListener('mousedown', () => {
      if (mode === 'Game') {
        holdTimeout = setTimeout(() => {
          nextSection(sectionInfo[sectionIndex].name,
          sectionInfo[sectionIndex].minutes);
        }, 1400);
      }
    });
    
    document.getElementById('btnE').addEventListener('mouseup', () => {
      switch (mode) {
        case 'Game Setup':
          if (!isEditMode) { // Change mode to Team Setup
            mode = 'Team Setup';
            updateMode();
          }
          break;
        case 'Team Setup': // Start Game
          if (!isEditMode) {
            mode = 'Game';
            updateMode();
          }
          break;
        case 'Game':
          clearTimeout(holdTimeout); // Cancel action because A wasn't held for long enough
          if (sectionEnd) { // Move to next game section
            sectionEnd = false
            nextSection(sectionInfo[sectionIndex].name,
            sectionInfo[sectionIndex].minutes);
          } else if (gameTimer.isPaused() === true) { // start/stop timer
            gameTimer.resume();
          } else {
            gameTimer.pause();
          }
          break;
        case 'Card Reporting': // Submit and report current card, return to game
          cardReports.push({
            color: cardFields[0].value,
            team: cardFields[1].value,
            playerNum: cardFields[2].value,
            reason: cardFields[3].value
          });
          mode = 'Game';
          renderGameScreen();
          break;
        case 'Game Summary':
          break;
        default:
          console.log('invalid mode')
          break;
      }
    });

    // Timer creator
    function startTimer(durationInSeconds, parentElement, onEndCallback) {
        if (!onEndCallback) onEndCallback = function () {};

        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer');
        parentElement.appendChild(timerDiv);

        let remaining = durationInSeconds;
        let paused = false;
        let intervalId = null;

        function updateDisplay() {
            const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
            const seconds = (remaining % 60).toString().padStart(2, '0');
            timerDiv.textContent = minutes + ':' + seconds;
        }

        function tick() { // Increment timer
            if (!paused && remaining > 0) {
                remaining--;
                updateDisplay();
            } else if (remaining <= 0) {
                clearInterval(intervalId);
                timerDiv.textContent = '00:00';
                onEndCallback();
            }
        }

        updateDisplay();
        intervalId = setInterval(tick, 1000);

        return {
            stop: function () {
                clearInterval(intervalId);
            },
            pause: function () {
                paused = true;
            },
            resume: function () {
                paused = false;
            },
            element: timerDiv,
            getTimeLeft: function () {
                return remaining;
            },
            isPaused: function () {
                return paused;
            }
        };
    }

    
    function renderStats() { // Generate game interface
      const team1Name = teamFields[0].value.join('');
      const team2Name = teamFields[1].value.join('');
      statsDiv.innerHTML = '';
      statsDiv.appendChild(createTeamColumn('team1', team1Name));
      statsDiv.appendChild(createTeamColumn('team2', team2Name));
      fieldsDiv.appendChild(statsDiv);
    }
      
    function createTeamColumn(team, label) {
      const subsAllowed = gameFields[2].value;
      let colorIndex = team === 'team1' ? 2 : 3;
      const col = document.createElement('div');
      col.style.textAlign = 'center';
      col.innerHTML = `
        <div style="font-size: 2rem; font-weight: bold">${label}
        <span class="color-box" style="background-color:
        ${teamFields[colorIndex].value};"></span></div>
        <div style="margin-top: 15px">Goals: ${teamStats[team].goals}</div>
        <div style="margin-top: 15px">Subs: ${teamStats[team].subs} / ${subsAllowed}</div>`;
        return col;
    }
    
    function applyStatChange(team, type, amount) { // increase or decrease goals or sub count
      switch (team.toString() + type) {
        case '1goals':
          teamStats.team1.goals = Math.max(0, teamStats.team1.goals + amount);
          break;
        case '1subs':
          teamStats.team1.subs = Math.max(0, teamStats.team1.subs + amount);
          break;
        case '2goals':
          teamStats.team2.goals = Math.max(0, teamStats.team2.goals + amount);
          break;
        case '2subs':
          teamStats.team2.subs = Math.max(0, teamStats.team2.subs + amount);
          break;
      }
      renderStats();
    }
    
    function nextSection(name, minutes) {
      pendingAdjustment = null;
      if (sectionIndex === 3 && (gameFields[3].value === false || 
      teamStats.team1.goals !== teamStats.team2.goals)) { // Test if game should end
        endGame();
      } else if (sectionIndex === 5) { // Test if game should end
        endGame();
      } else { // Go to the next game section
        sectionEnd = false;
        sectionIndex++;
        modeHeader.innerText = name;
        fieldsDiv.innerHTML = '';
        timeRemaining = minutes * 60; // seconds
        gameTimer = startTimer(timeRemaining, fieldsDiv, endSection);
        renderStats();
      }
    }
    
    function endGame() { // End game, display score & cards reported summary
      mode = 'Game Summary';
      modeHeader.innerText = 'Game Summary';
      fieldsDiv.innerHTML = '';
      const team1Name = teamFields[0].value.join('');
      const team2Name = teamFields[1].value.join('');

      const summaryContainer = document.createElement('div');
      summaryContainer.classList.add('summary');

      function makeTeamColumn(name, goals) {
        const col = document.createElement('div');
        let colorIndex = name === team1Name ? 2 : 3;
        col.style.textAlign = 'center';
        col.innerHTML = `
          <div style="font-weight: bold; font-size: 2.5rem;">${name}
          <span class="color-box" style="background-color:
          ${teamFields[colorIndex].value};"></span></div>
          <div style="font-size: 4rem; font-weight: bold;">${goals}</div>
        `;
        return col;
      }

      summaryContainer.appendChild(makeTeamColumn(team1Name, teamStats.team1.goals));
      summaryContainer.appendChild(makeTeamColumn(team2Name, teamStats.team2.goals));
      fieldsDiv.appendChild(summaryContainer);

      if (cardReports.length > 0) { // Display cards if any are reported
        const cardsHeader = document.createElement('div');
        cardsHeader.classList.add('card-header');
        cardsHeader.innerText = 'Cards:';
        fieldsDiv.appendChild(cardsHeader);
        cardReports.forEach((card) => {
          const cardDiv = document.createElement('div');
          cardDiv.classList.add('cards');
          cardDiv.innerText =
            `${card.color} Card | Team ${card.team} | #${card.playerNum} | ${card.reason}`;
          fieldsDiv.appendChild(cardDiv);
        });
      } else { // No cards are reported
        const noCards = document.createElement('div');
        noCards.classList.add('cards');
        noCards.style.fontSize = '1.5rem';
        noCards.innerText = 'No cards reported.';
        fieldsDiv.appendChild(noCards);
      }
    }

    function renderGameScreen() { // Get back to game screen after card reporting
      fieldsDiv.innerHTML = '';
      fieldsDiv.appendChild(gameTimer.element);
      renderStats();
      modeHeader.innerText = sectionInfo[sectionIndex - 1].name;
      gameTimer.resume();
    }
