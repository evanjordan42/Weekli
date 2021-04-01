import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Schedules(props) {
  //userList should exclude shifts
  const [prefIndex, setPrefIndex] = useState({})
  const [userList, setUserList] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [bestSchedule, setBestSchedule] = useState([]);
  const [bestScore, setBestScore] = useState(-Infinity);

  function getUsers() {
    axios.get('/users')
      .then((res) => {
        let users = res.data
        let newUserList = [];
        for (let user of users) {
          if (user.name === 'Add Shifts') {
            setShifts(shiftBreak(user.prefs))
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
  // converts preference-format shifts into array of arrays, each subarray being a shift
  function shiftBreak(shifts) {
    let slotArray = [];
    for (let slot in shifts) {
      slotArray.push(slot);
    }
    let shiftArray = [];
    let currentShift = [];
    for (var i = 0; i < slotArray.length; i++) {
      currentShift.push(slotArray[i])
      var currentTime = slotArray[i].slice(3, 6);
      var nextTime = slotArray[i + 1].slice(3, 6) || 0
      if (Number(currentTime) + 15 !== Number(nextTime) && currentTime.slice(2, 3) !== '45') {
        shiftArray.push(currentShift);
        currentShift = [];
      } else if (currentTime.slice(2, 3) === '45' && Number(currentTime) + 55 !== Number(nextTime)) {
        shiftArray.push(currentShift);
        currentShift = [];
      }
    }
    return shiftArray
  }

  useEffect(getUsers, [props.showingSchedules])

  function generateSchedules() {
    // create master schedule with each user present n times, n being their maxShifts
    // create every permutation and add to an array
    // create another array with correctly sized unique schedules
    // iterate through and keep track of schedules with highest total preference score (might be lots of variations for each score)
    // ^ too many permutations for reasonably sized schedules, would take too long

    // create master schedule, shuffle it 10,000,000 or 100,000,000 times, truncating and scoring each combo, keeping track of top 5 schedules

    let master = [];
    let numShifts = shifts.maxShifts;

    for (var user of userList) {
      for (var i = 0; i < user.maxShifts; i++) {
        master.push(user.name);
      }
    }
    for (var i = 0; i < 10000000; i++) {
      score(shuffle(master))
    }
  }

  function score(inputSchedule) {
    let totalScore = 0;
    // score and keep track of best schedule

    // if the number of shifts is not evenly divisble by the number of users, and each user can work the same amount, the master schedule will be too long, and so must get truncated.
    var schedule = inputSchedule.slice(0, shifts.length)
    for (var i = 0; i < shifts.length; i++) {
      var currentShift = shifts[i]
      var currentUser = schedule[i];
      for (var j = 0; j < currentShift.length; j++) {
        var currentSlot = currentShift[j]
        // if assigned user cannot work, score is -inf
        if (prefIndex[currentUser][currentSlot] === -2) {
          totalScore = -Infinity;
          i = shifts.length;
          break;
        }
        for (var users of userList) {
          // if another user must work this shift, score is -inf
          if (user.prefs[currentShift] === 2 && user.name !== currentUser) {
            totalScore = -Infinity
            i = shifts.length;
            break;
          }
        }
        totalScore += prefIndex[currentUser][currentSlot] || 0
      }
    }
  }

  function shuffle(inputArray) {
    var array = [...inputArray]
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  return (
    <div className="schedules">

    </div>
  )
}

export default Schedules;