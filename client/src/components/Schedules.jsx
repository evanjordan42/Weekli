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

  // converts preference-format shifts into an array of arrays, each subarray being a shift
  function shiftBreak(shifts) {
    let slotArray = [];
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
    for (let user of userList) {
      for (let i = 0; i < user.maxShifts; i++) {
        master.push(user.name);
      }
    }
    let bestUnslicedSchedule = master;
    let bestScore = -Infinity;

    for (let i = 0; i < localShifts.length; i++) {
      for (let j = i; j < localShifts.length; j++) {
        for (let k = 0; k < localShifts.length; k++) {
          if (score(swap(bestUnslicedSchedule, i, j, k))) {
            i = 0;
            j = 0;
            k = 0;
          }
        }
      }
    }

    let bestSchedule = bestUnslicedSchedule.slice(0, localShifts.length)
    setBestSchedule(bestSchedule);
    setGenerating(false);
    labelShifts(localShifts, bestSchedule);
    console.log('score: ', bestScore)

    function score(inputSchedule) {
      let totalScore = 0;

      // if the number of shifts is not evenly divisble by the number of users, and each user can work the same amount, the master schedule will be too long, and so must get truncated.
      let schedule = inputSchedule.slice(0, localShifts.length)

      for (let i = 0; i < localShifts.length; i++) {
        let currentShift = localShifts[i]
        let currentUser = schedule[i];
        for (let j = 0; j < currentShift.length; j++) {
          let currentSlot = currentShift[j]
          // if assigned user cannot work this shift, score is heavily reduced
          if (prefIndex[currentUser][currentSlot] === -2) {
            totalScore -= 1000;
          }
          for (let user of userList) {
            // if another user must work this shift, score is heavily reduced
            if (user.prefs[currentShift] === 2 && user.name !== currentUser) {
              totalScore -= 1000
            }
          }
          // for fairness: a schedule that has two people working times they have no preference for should have a higher score than if one person were working when they prefered and someone else worked when they prefered not to
          if (prefIndex[currentUser][currentSlot] === -1) {
            totalScore -= 1.01
          } else {
            totalScore += prefIndex[currentUser][currentSlot] || 0
          }
        }
      }
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestUnslicedSchedule = inputSchedule
        return true;
      }
      return false;
    }
  }

  function swap(inputArray, first, second, third) {
    let array = [...inputArray]
    let temporaryValue;
    temporaryValue = array[first];
    array[first] = array[second];
    array[second] = temporaryValue;

    if (third || third === 0) {
      temporaryValue = array[first];
      array[first] = array[third];
      array[third] = temporaryValue;
    }
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

/*
old algorithms:

    let i = 0;
    // in an array of size n, there are n^2 number of possible mutations, and multiplying it gives it better odds that all the possible mutations occur
    let numberOfMutations = Math.pow(localShifts.length, 2) * 3
    while (i < numberOfMutations) {
      if (score(mutate(bestUnslicedSchedule, false))) {
        i = 0;
      }
      i++
    }
    i = 0;
    while (i < numberOfMutations * localShifts.length) {
      if (score(mutate(bestUnslicedSchedule, true))) {
        i = 0;
      }
      i++
    }

    for (let i = 0; i < localShifts.length; i++) {
      for (let j = i; j < localShifts.length; j++) {
        if (i !== j) {
          if (score(swap(bestUnslicedSchedule, i, j))) {
            i = 0;
            j = 0;
          }
        }
      }
    }


  function mutate(inputArray, doubleSwap) {
    let array = [...inputArray]
    let temporaryValue, randomIndex1, randomIndex2, randomIndex3;

    // guarantee true mutation
    var loopBreaker = 0;
    do {
      loopBreaker++;
      randomIndex1 = Math.floor(Math.random() * array.length);
      randomIndex2 = Math.floor(Math.random() * array.length);
    } while (array[randomIndex1] === array[randomIndex2] && loopBreaker < 1000)

    temporaryValue = array[randomIndex1];
    array[randomIndex1] = array[randomIndex2];
    array[randomIndex2] = temporaryValue;

    loopBreaker = 0;
    if (doubleSwap) {
      do {
        loopBreaker++;
        randomIndex3 = Math.floor(Math.random() * array.length);
      } while (array[randomIndex1] === array[randomIndex3] && loopBreaker < 1000)

      temporaryValue = array[randomIndex1];
      array[randomIndex1] = array[randomIndex3];
      array[randomIndex3] = temporaryValue;
    }

    return array;
  }




*/