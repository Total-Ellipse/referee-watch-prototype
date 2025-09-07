# referee-watch-prototype

## Introduction

I've been a certified soccer referee since I was 13. For quite a while, this idea of a watch specifically designed to keep track of everything you need mid-game has been bouncing around in my head. It always felt clunky pulling a little notepad out everytime someone scored. Since I couldn't play or referee soccer myself while recovering from knee surgery this summer, I decided to try and make a functional prototype to keep me occupied. And, since my programming experience is limited to python and about 10 minutes of C, I figured I might as well see how hard it is to make a website. As is probably obvious by the commits in early September, this project took quite a bit longer than expected. I went through a decent portion of the HTML, CSS, and Javascript courses on https://w3schools.com/ and stumbled my way through this project with an abundance of Google searches and Stack Overflow queries. Ultimately, I'm happy with the result for my first time ever making a website or using Javascript, and I ended up with something that isn't completely hideous. Feel free to point and laugh at my code or get some inspiration for your own projects. The below section documents the controls and features of my watch.

## Controls

The website is hosted on github pages at the URL: https://total-ellipse.github.io/referee-watch-prototype/
The watch is organized into several different modes: Game Setup, Team Setup, Game, Card Reporting, and Game Summary. The controls and actions you can take change with each mode.

### Game Setup

In this mode, which will be displayed when the website loads, you can set various different parameters for the game itself. These parameters include:
- Half Length (how many minutes long each half is)
- Halftime Length (how many minutes halftime should be)
- Substitution Limit (how many substitutes each team is allowed per game)
- Enable Overtime (disable/enable overtime for final or semifinal games)
- Overtime Length (how many mintutes long each overtime period should be)

To edit these parameters, you must enter edit mode. Edit mode is a sub-mode present in the Game Setup and Team Setup modes. To enter edit mode, hold down button A until an indicator reading "Edit" appears in the bottom right of the watch face. Here, the first setting, Half Length, should be flashing. This flashing indicates that it is the current selected setting. To change your selected setting, press (do not hold) A to cycle through the settings. To edit the value of the selected setting, press B to increase the value or D to decrease the value. When you are done editing the settings, hold down A again until the edit indicator disappears. From here, you can press E to progress into Team Setup mode.

### Team Setup

The parameters you can enter in Team Setup are as follows:
- Team 1 Abbrev (a 3 letter abbreviation for the name of the the first team)
- Team 2 Abbrev (a 3 letter abbreviation for the name of the the second team)
- Team 1 Color (the jersey color of the first team)
- Team 2 Color (the jersey color of the second team)

The abbreviations and team colors will both be displayed during the Game and Game Summary modes to identify which team is which. The controls in Team Setup are about the same as Game Setup. Hold A to enter and exit edit mode. Press A to change which setting you are changing (note that you cycle through each character in the abbreviations). B increases the value of the selected setting and D decreases the value. When you are done editing, exit edit mode and hit E to move on to Game mode. If you need to go back to Game Setup, press C.

### Game

Game mode is organized into sections, with the section name displayed at the top of the watch. The sections are 1st Half, Halftime, 2nd Half, 1st Overtime, and 2nd Overtime in that order. Note that you will only encounter the overtime sections if overtime is enabled and if the game is tied at the end of the 2nd half. In game mode, there are several actions you can perform. Pressing E will start or stop the current timer. To increase/decrease the goals or substitution count of either team, you need to press two buttons. First, press B if you'd like to increase the value in question or D if you'd like to decrease it. Then, press:
- A to alter the goals of the team on the left
- B to alter the goals of the team on the right
- C to alter the sub count of the team on the left
- D to alter the sub count of the team on the right

Note that the above button mappings are based on the physical location of the values you can alter. (A corresponds to the goals of the team on the left because that is the top left value and A is the top left button). Once the timer for your current section ends, press E to move on to the next section. You can also skip to the next section before the timer ends by holding down E until the section name changes. While in Game mode, you can also record red/yellow cards. Press C at any time to pause the section timer and enter Card Reporting.

### Card Reporting

In Card Reporting mode, you will see several different fields about the card that you can edit. These fields are:
- Card Color (red/yellow)
- Team (which team the offending player is on)
- Player Number (the number of the offending player)
- Reason (select one of several 5-letter abbreviations for the reason the card was given)

Similarly to the Game Setup and Team Setup modes, the currently selected field will be flashing. To change the selected field, simply press A. Pressing B increases the value of the selected field and pressing D decreases it. When selecting the reason, see the key below for what each one means:
- RFOUL: commits a reckless challenge or foul
- DGPLY: dangerous play
- DOGSO: denying an obvious goal-scoring opportunity, stops or interferes with a promising attack
- UNBHV: unsportsmanlike behavior
- VIOLC: violent conduct
- CFOUL: continual fouls
- DELAY: wastes time
- TRICK: exaggerates a foul, or otherwise makes some other attempt to trick the referee and circumvent the rules
- XCELB: excessive celebration
- HANDG: trying to score a goal with the hand/arm
- 2CARD: 2 yellow cards
- OTHER: other

Once you have entered all relevant information about a card, press E to record it and return to Game mode. If you enter Card Reporting by accident, press C to return to Game mode without recording a card.

### Game Summary

You enter Game Summary mode once the game has ended. This happens when the timer expires on the last section of your game and you press E or when you skip the last section of your game by holding E in Game mode. The last section can either be 2nd Half (if overtime is disabled or if the score is not tied) or it can be 2nd Overtime (if overtime is enabled and the score is tied at the end of the 2nd Half). There are no available actions in Game Summary mode. It simply displays the score of the game and any cards you have reported. To start another game, refresh the webpage.

## Conclusion

For a non-physical proof of concept, I'm happy with how this project turned out. I feel it has the basic features to make it adaptable to user error or unforseen circumstances. For example, you can decrease goals if you added then to the wrong team, cancel reporting a card if you hit the button on accident, and end the game early if the game is stopped by weather or unfit field conditions. If this were to be made into a real product, there are definitely some quality of life features I'd want to add like an overall more attractive layout and the ability to hold B or D to rapidly increase/decrease settings. I also think it'd be really neat if you could export game data from the watch into the online referee assignment systems to quickly report game results, but that would certainly be a far off goal. Anyway, thanks for checking out my project!
