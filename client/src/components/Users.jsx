import React, { useState, useEffect } from 'react';
import axios from 'axios'

function Users({ selectedUser, selectUser }) {
  const [userList, setUserList] = useState([])
  const [form, setForm] = useState('')
  const [addUser, setAddUser] = useState(false);

  function getUsers() {
    axios.get('/users')
      .then((res) => {
        setUserList(res.data);
      })
  }

  useEffect(getUsers, [selectedUser])

  // for reliable functioning, object is populated with 0's
  function populatePrefs() {
    let populatedPrefs = {};
    let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    days.map((day) => {
      times().map((time) => {
        populatedPrefs[day + time] = 0
      })
    })

    return populatedPrefs;
  }

  function handleAdd(e) {
    if (form) {
      e.preventDefault();
      let newUserList = userList;
      newUserList.push({ name: form, maxShifts: 0, prefs: populatePrefs() });
      setUserList(newUserList);
      selectUser({ name: form, maxShifts: 0, prefs: populatePrefs() });
      setForm('');
    } else {
      alert('Must enter name');
    }
  }

  function handleChange(e, func) {
    e.preventDefault();
    func(e.target.value)
  }

  function addShifts() {
    for (let user of userList) {
      if (user.name === "Add Shifts") {
        selectUser(user)
        return;
      }
    }
    selectUser({ name: 'Add Shifts', maxShifts: 0, prefs: populatePrefs() })
  }

  function times() {
    var output = [];
    for (var i = 0; i < 24; i++) {
      for (var j = 0; j < 4; j++) {
        output.push(pad(`${i}${(j * 15) || '00'}`, 4))
      }
    }
    return output
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
  }

  return (
    <div className="users">
      <div className="user-list">
        <div style={{ fontStyle: "italic", marginBottom: "5px" }}>Select a user to set their preferences:</div>
        {
          userList.map((user) => {
            if (user.name === 'Add Shifts') {
              if (userList.length === 1) {
                return <div key={'add shifts'} className="add-user-msg">The list of users will appear here!</div>
              }
              return null
            }
            return (<div key={user.name} onClick={() => { selectUser(user) }} className="user">{user.name}</div>)
          })
        }
        {
          userList[0] ? null : <div className="add-user-msg">The list of users will appear here!</div>
        }
      </div>
      <button onClick={() => {
        if (addUser) { setAddUser(false); } else { setAddUser(true); }
      }} className="button">Add New User</button>
      {
        addUser ? <form>
          <input className="user-form" type="text" onChange={(e) => { handleChange(e, setForm) }} value={form} placeholder="Enter a new name"></input>
          <button className="button small-button" onClick={handleAdd}>Add</button>
        </form> : <br></br>
      }
      <button className="button" onClick={addShifts}>Set Shifts</button>
    </div>
  )
}

export default Users;