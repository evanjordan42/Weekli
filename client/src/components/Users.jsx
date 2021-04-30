import React, { useState, useEffect } from 'react';
import axios from 'axios'

function Users(props) {
  const [userList, setUserList] = useState([])
  const [form, setForm] = useState('')
  const [addUser, setAddUser] = useState(false);

  function getUsers() {
    axios.get('/users')
      .then((res) => {
        setUserList(res.data);
      })
  }

  useEffect(getUsers, [props.selectedUser])

  function handleAdd(e) {
    if (form) {
      e.preventDefault();
      let newUserList = userList;
      newUserList.push({ name: form, maxShifts: 0, prefs: { '_ph': null } }); // _ph is placeholder
      setUserList(newUserList);
      props.selectUser({ name: form, maxShifts: 0, prefs: { '_ph': null } })
      //alert(`User added! Set preferences for ${form}, going back will not save user`)
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
        props.selectUser(user)
        return;
      }
    }
    props.selectUser({ name: 'Add Shifts', maxShifts: 0, prefs: { '_ph': null } })
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
            return (<div key={user.name} onClick={() => { props.selectUser(user) }} className="user">{user.name}</div>)
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
          <button className="button add-user-button" onClick={handleAdd}>Add</button>
        </form> : <br></br>
      }
      <button className="button" onClick={addShifts}>Add shifts</button>
    </div>
  )
}

export default Users;