# referee-watch-prototype

## Intro

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

To edit these parameters, you must enter edit mode. Edit mode is a sub-mode present in the Game Setup and Team Setup modes. To enter edit mode, hold down button A until an indicator reading "Edit" appears in the bottom right of the watch face. Here, the first setting, Half Length, should be flashing. This flashing indicates that it is the current selected setting. To change your selected setting, press (do not hold) A to cycle through the settings. To edit the value of the selected setting, press B to increase the value or D to decreased the value. When you are done editing the settings, hold down A again until the edit indicator disappears. From here, you can press E to progress into Team Setup mode.

### Team Setup

The parameters you can enter in Team Setup are as follows:
- Team 1 Abbrev (a 3 letter abbreviation for the name of the the first team)
- Team 2 Abbrev (a 3 letter abbreviation for the name of the the second team)
- Team 1 Color (the jersey color of the first team)
- Team 2 Color (the jersey color of the second team)

The abbreviations and team colors will both be displayed during the Game and Game Summary modes to identify which team is which. The controls in Team Setup are about the same as Game Setup. Hold A to enter and exit edit mode. Press A to change which setting you are changing (note that you cycle through each character in the abbreviations). B increases the value of the selected setting and D decreased the value. When you are done editing, exit edit mode and hit E to move on to Game mode. If you need to go back to Game Setup, press C.
  
