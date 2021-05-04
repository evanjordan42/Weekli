import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Schedules({ showingSchedules, shifts, setShifts, bestSchedule = [], setBestSchedule, user, labelShifts }) {
  //userList should exclude shifts
  const [prefIndex, setPrefIndex] = useState({})
  const [userList, setUserList] = useState([]);
  const [runningBestScore, setRunningBestScore] = useState(-1000)
  const [runningBestSchedule, setRunningBestSchedule] = useState([])
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
        for (var user of users) {
          index[user.name] = user.prefs
        }
        setPrefIndex(index)
      })
  }
  function generateSchedules() {
    // create master schedule with each user present n times, n being their maxShifts
    // create every permutation and add to an array
    // create another array with correctly sized unique schedules
    // iterate through and keep track of schedules with highest total preference score (might be lots of variations for each score)
    // ^ too many permutations for reasonably sized schedules, would take too long

    // create master schedule, shuffle it 10,000,000 or 100,000,000 times, truncating and scoring each combo, keeping track of top 5 schedules

    // v2.0: descent with modification
    // the starting schedule will be the best out of e.g. 10,000 random schedules.
    // have a while loop that partially shuffles a schedule and scores it, if a schedule is better, reset looping variable and redefine seed schedule to be partially shuffled.

    setGenerating(true);


    let master = [];
    let bestScore = runningBestScore;
    let bestSchedule = runningBestSchedule;

    for (var user of userList) {
      for (var i = 0; i < user.maxShifts; i++) {
        master.push(user.name);
      }
    }

    // while i < 10000 lets say, partially shuffle bestSchedule then score it, if score() returns true, reset i

    bestSchedule = master

    var i = 0;
    while (i < 1000) {
      if (score(mutate(bestSchedule))) {
        i = 0;
      }
      i++
    }

    setRunningBestScore(bestScore)
    setRunningBestSchedule(bestSchedule)
    setBestSchedule(bestSchedule)
    setGenerating(false);
    console.log('done, score: ', bestScore)
    labelShifts(localShifts, bestSchedule);

    function score(inputSchedule) {
      let totalScore = 0;
      // score and keep track of best schedule

      // if the number of shifts is not evenly divisble by the number of users, and each user can work the same amount, the master schedule will be too long, and so must get truncated.
      var schedule = inputSchedule.slice(0, localShifts.length)

      for (var i = 0; i < localShifts.length; i++) {
        var currentShift = localShifts[i]
        var currentUser = schedule[i];
        for (var j = 0; j < currentShift.length; j++) {
          var currentSlot = currentShift[j]
          // if assigned user cannot work, score is -inf
          if (prefIndex[currentUser][currentSlot] === -2) {
            totalScore = -1000;
            i = localShifts.length;
            break;
          }
          for (var user of userList) {
            // if another user must work this shift, score is -inf
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
        console.log('new best')
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
    for (var i = 0; i < slotArray.length; i++) {
      currentShift.push(slotArray[i])
      var currentDay = slotArray[i].slice(0, 3);
      var nextDay = (slotArray[i + 1] || [0]).slice(0, 3);
      var currentTime = slotArray[i].slice(3, 7);
      var nextTime = (slotArray[i + 1] || [0]).slice(3, 7);
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
    var array = [...inputArray]
    var temporaryValue, randomIndex1, randomIndex2;

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
        generating ? <div>Error: there is likely no possible schedule with the current preferences and shifts. Double check these and try again</div> : null
      }

      <button className="button" onClick={generateSchedules}>Generate Schedule</button>
      <div>(Can take a minute!)</div>
    </div>
  )
}

export default Schedules;