# Weekli: a preference saving schedule maker for repeating weekly schedules

This program allows multiple users to enter in preferences for working a given time block, and after entering shift times can generate schedules that best fit the users' preferences

## To start:

Ensure an instance of MongoDB is running on the default port 27017.

Run 'npm start'

## To use:

Add users with the 'Add New User' button and use the schedule interface to set preferences for specific periods of time. Click the preference selector (starts at 'No preference') to cycle through the preference options. These options include 'Cannot work', 'Prefer not to work', 'No preference', 'Prefer to work', and 'Must work'. Time can be selected by clicking individual 15-minute blocks, or by toggling the 'Enable painting' button, which allows a user to quickly set preferences for stretches of time. To paint a block of time, click once to begin painting, then move the mouse over blocks to fill them in, then click again to stop painting (clicking and dragging will not work!).

Each user must also enter the maximum number of shifts they are available for.

Enter shifts by clicking the 'Set Shifts' button and defining blocks of time in the same manner as setting preferences.

To view a generated schedule, click the 'Go to schedule' button, then click 'Generate schedule'. If there are multiple possible schedules with the same preference score, clicking this will cycle through them randomly.
