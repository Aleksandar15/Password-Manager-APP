import './App.css';
import {useState, useEffect} from "react";
import Axios from 'axios';

function App() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([])
  useEffect(() => {
    Axios.get('http://localhost:3001/showpasswords').then((response) => {
      setPasswordList(response.data)
  })
  }, [])

  const addPassword = () => {
    if (password === '' || title === '') {
      alert("Password or Website cannot be empty!");
    } else {
    Axios.post('http://localhost:3001/addpassword',  {
      password: password, 
      title: title
    });}
  }

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
        return val.id === encryption.id ? {
          id: val.id, 
          password: val.password, 
          title: response.data,
          iv: val.iv
        } : val
      }))
    })
  }
  return (
    
    <div className="App">
      <div className="AddingPassword">
      <p className="insert">Enter your password:</p>

        <input type="text" 
        className="insert"
        placeholder="Ex. password123" 
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        />

        <p className="insert">Enter the website:</p>
        <input type="text" 
        className="insert"
        placeholder="Ex. Facebook"
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        /> 
        <input onClick={addPassword} type="button" className="addPw" value="Add Password" /> 

      </div>
      
      <div className="Passwords">
      <i>(click below to show saved passwords)</i>
        {passwordList.map((val,key) => {
          return (
          <div className="password" onClick={() => 
          {decryptPassword({
            password: val.password, 
            iv: val.iv, 
            id: val.id
          })}}
          key={key}
          > 
            <h3>{val.title}</h3>
           </div>
        )})}
      </div>
    </div>
  );
}

export default App;
