


# Weekli: a preference saving schedule maker for repeating weekly schedules

This program allows multiple users to enter preferences for working blocks of time, and after entering shifts can generate schedules that best fit the users' preferences.

## Getting started

### Prerequisites

* [MongoDB](https://docs.mongodb.com/manual/installation/)
* [Node.js](https://nodejs.org/en/download/)

### Installation

1. Clone this repo to your device `git clone https://github.com/evanjordan42/Weekli.git`.
2. Navigate to the `Weekli` folder in the terminal.
3. Run `npm install`.

### Initializing Server

1. Ensure an instance of MongoDB is running on the default port 27017.
2. Navigate to the `Weekli` folder in the terminal.
3. Run `npm start`.
4. Navigate to `http://localhost:8000` in your browser.


## Using Weekli

### Add users

1. Click the `Add User` button and enter a name.
2. Click `Add`, this will take you to that user's preference page.

### Set preferences

1. Click a user's name to enter the preference-setting interface.
2. Click the preference selector button (starts at `No preference`) to cycle through the options, including `Cannot work`, `Prefer not to work`, `No preference`, `Prefer to work`, and `Must work`.
3. Fill in periods of time by clicking individual 15 minute blocks or by clicking and dragging.
4. Make sure to enter the maximum number of shifts that user can work in a week.
5. Click `Save and exit`.

### Set shifts

1. Click `Set Shifts` to enter the shift-setting interface.
2. Setting shifts works the same way as setting preferences.
3. Enter the number of shifts in a week.
4. Click `Save and exit`

### Generate schedule

1. Click `Go to Schedule`.
2. Click `Generate schedule`.

## Video Demo



https://user-images.githubusercontent.com/76127010/124680133-9a3d0a00-de7a-11eb-9eb8-9024762fb010.mov



