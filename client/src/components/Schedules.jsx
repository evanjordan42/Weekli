import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Schedules({ showingSchedules, shifts, setShifts, setBestSchedule, user, labelShifts }) {
  //userList should exclude shifts
  const [prefIndex, setPrefIndex] = useState({})
  const [userList, setUserList] = useState([]);
  const [localShifts, setLocalShifts] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(getUsers, [showingSchedules])

  function getUsers() {
    axios.get('/users')
      .then((res) => {
        let users = res.data
        let newUserList = [];
        for (let user of users) {
          if (user.name === 'Add Shifts') {
            setShifts(shiftBreak(user.prefs))
            setLocalShifts(shiftBreak(user.prefs))
          } else {
            newUserList.push(user)
          }
        }
        setUserList(newUserList)
        let index = {}
        for (let user of users) {
          index[user.name] = user.prefs
        }
        setPrefIndex(index)
      })
  }

  function labelShifts(shifts, schedule) {
    for (let i = 0; i < shifts.length; i++) {
      let shift = shifts[i];
      let midpoint = shift[Math.floor(shift.length / 2)]
      document.getElementById(midpoint).innerHTML = "<span class='schedule-name-label'>" + schedule[i] + "</span>"
    }
  }

  function generateSchedules() {
    setGenerating(true);

    let master = [];
    let bestScore = -1000

    for (let user of userList) {
      for (let i = 0; i < user.maxShifts; i++) {
        master.push(user.name);
      }
    }

    let bestSchedule = master

    let i = 0;
    while (i < 2000) {
      if (score(mutate(bestSchedule))) {
        i = 0;
      }
      i++
    }

    setBestSchedule(bestSchedule)
    setGenerating(false);
    console.log('done, score: ', bestScore)
    labelShifts(localShifts, bestSchedule);

    function score(inputSchedule) {
      // score and keep track of best schedule

      let totalScore = 0;

      // if the number of shifts is not evenly divisble by the number of users, and each user can work the same amount, the master schedule will be too long, and so must get truncated.
      let schedule = inputSchedule.slice(0, localShifts.length)

      for (let i = 0; i < localShifts.length; i++) {
        let currentShift = localShifts[i]
        let currentUser = schedule[i];
        for (let j = 0; j < currentShift.length; j++) {
          let currentSlot = currentShift[j]
          // if assigned user cannot work, score is -1000
          if (prefIndex[currentUser][currentSlot] === -2) {
            totalScore = -1000;
            i = localShifts.length;
            break;
          }
          for (let user of userList) {
            // if another user must work this shift, score is -1000
            if (user.prefs[currentShift] === 2 && user.name !== currentUser) {
              totalScore = -1000
              i = localShifts.length;
              break;
            }
          }
          totalScore += prefIndex[currentUser][currentSlot] || 0
        }
      }
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestSchedule = schedule
        return true;
      }
      return false;
    }
  }

  // converts preference-format shifts into array of arrays, each subarray being a shift
  function shiftBreak(shifts) {
    let slotArray = [];
    delete shifts._ph
    for (let slot in shifts) {
      slotArray.push(slot);
    }
    let shiftArray = [];
    let currentShift = [];
    for (let i = 0; i < slotArray.length; i++) {
      currentShift.push(slotArray[i])
      let currentDay = slotArray[i].slice(0, 3);
      let nextDay = (slotArray[i + 1] || [0]).slice(0, 3);
      let currentTime = slotArray[i].slice(3, 7);
      let nextTime = (slotArray[i + 1] || [0]).slice(3, 7);
      if (Number(currentTime) + 15 !== Number(nextTime) && currentTime.slice(2, 4) !== '45' || currentDay !== nextDay) {
        shiftArray.push(currentShift);
        currentShift = [];
      } else if (currentTime.slice(2, 4) === '45' && Number(currentTime) + 55 !== Number(nextTime) || currentDay !== nextDay) {
        shiftArray.push(currentShift);
        currentShift = [];
      }
    }
    return shiftArray
  }

  function mutate(inputArray) {
    let array = [...inputArray]
    let temporaryValue, randomIndex1, randomIndex2;

    randomIndex1 = Math.floor(Math.random() * array.length);
    randomIndex2 = Math.floor(Math.random() * array.length);

    temporaryValue = array[randomIndex1];
    array[randomIndex1] = array[randomIndex2];
    array[randomIndex2] = temporaryValue;

    return array;
  }

  return (
    <div className="schedules">
      {
        generating ? <div>Error: cannot display schedule. There is likely no possible schedule with the current preferences and shifts. Double check these and try again</div> : null
      }

      <button className="button" onClick={generateSchedules}>Generate Schedule</button>
      <div>(Can take a minute for large schedules)</div>
    </div>
  )
}

export default Schedules;