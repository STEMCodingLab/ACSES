import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import axios from 'axios';

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const [showModel,setShowModel]=useState(false);
  const [notesList,setNotesList]=useState([])

  const token=localStorage.getItem('jwt')
  const user=JSON.parse(localStorage.getItem('user'))
  useEffect(() => {


   
    fetch('https://vivid-bloom-0edc0dd8df.strapiapp.com/api/users/me?populate=Avatar&populate=Background', { // 修改这个URL为你的API地址
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setProfile(data);
      console.log(data,8989);
    })
    .catch(error => console.error('Error fetching profile:', error));


      
      getData(user.id)
  }, []);

  const togglePasswordReset = () => {
    setShowPasswordReset(!showPasswordReset); // 切换显示状态
  };
  
  const resetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    const token = localStorage.getItem('jwt');
    axios.post('https://vivid-bloom-0edc0dd8df.strapiapp.com/api/auth/change-password', {
      currentPassword: currentPassword,
      password: newPassword,
      passwordConfirmation: confirmPassword,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      alert('Successfully changed password.');
    })
    .catch(error => {
      console.error('Error', error.response);
      alert(error.response.data.error.message || 'Error, please try again.');
    });
  };
  // 获取数据
  const getData =  (id) => {
   fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/notes?populate=*&filters[uid][$eq]=${id}`, { // 修改这个URL为你的API地址
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
    
      const result=data.data.map(item=>{
        return {
          text:item.attributes.text,
          time:item.attributes.time,
          id:item.id
        }
      })
      setNotesList(result)
    })
    .catch(error => console.error('Error fetching profile:', error));
  };
  // 提交
  const handleSubmit=async (data) => {
    console.log(data,'7777');
    const response = await axios.post('https://vivid-bloom-0edc0dd8df.strapiapp.com/api/notes', {
          data: {
            uid:user.id,
            ...data,
            time:moment(data.time).format('YYYY-MM-DD')
          
          }
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        getData(user.id)
        alert('Successfully');
  };
  // 删除
  const handleDelete=async (id) => {
    const response = await axios.delete(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/notes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    getData(user.id)
    alert('Successfully');
  };
  if (!profile) {
    return <div>Loading...</div>;
  }

  const avatarUrl = `${profile.Avatar.url}`;
  const backgroundUrl = `${profile.Background.url}`;


  return (
    <div className="container mx-auto my-5 ">
      <div className="rounded-lg shadow-lg " style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          {profile.Avatar && (
            <img
              src={`${profile.Avatar.url}`}
              alt="Profile"
              className="rounded-full"
              style={{ width: '100px', height: '100px' }}
            />
          )}
          <h1 className="text-2xl font-semibold">{profile.username}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={togglePasswordReset}>
            Reset Password / Hide
          </button>

          {showPasswordReset && (
            <div className="mt-4 flex flex-col items-center">
              <input
                className="mt-2 p-2 border rounded"
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input
                className="mt-2 p-2 border rounded"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input
                className="mt-2 p-2 border rounded"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={resetPassword}
              >
                Confirm
              </button>
            </div>
          )}
          
        </div>
        {/* 可以添加更多的个人信息展示 */}
          
      </div>

      <div style={{ backgroundColor: '#fff' }}>
      <button
          onClick={() => setShowModel(true)}
          className="mt-8"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)',
            transition: 'background-color 0.3s ease-in-out',
          }}
      >
        add
      </button>

      <div>
        <Table data={notesList} handleDelete={handleDelete}></Table>
      </div>
      {showModel && (<Modal onSubmit={handleSubmit} onClose={() => setShowModel(false)}> </Modal>)}
      </div>
   
    </div>
  );
};

const Table = ({data,handleDelete}) => {
 


  return (
    <table style={{ fontFamily: 'Arial, sans-serif', borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Time</th>
          <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Text</th>

          <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
             <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{item.time}</td>
            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{item.text}</td>
            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
              <button style={{ backgroundColor: '#f44336', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDelete(item.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 



const Modal = ({onSubmit,onClose }) => {
  const [inputValue, setInputValue] = useState('');
const [dateValue, setDateValue] = useState(new Date());
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {

    if(inputValue==''){
      return ;
    }
    onSubmit({time:dateValue,text:inputValue})
    setInputValue('');
    onClose()
  };
  const handleDateChange=(date)=>{
    console.log(date,moment(date).format('YYYY-MM-DD'));
    setDateValue(date)
  }

  return (
    <div style={{position:'fixed', top:0, left:0,  width: '100%', height: '100%',backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center' }}> 

    <div style={{ width: '500px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>add notes</h2>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ marginRight: '10px' }}>notes:</span>
      <textarea
      value={inputValue}
      onChange={handleInputChange}
      style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
    />
          <span style={{ marginRight: '10px' }}>date:</span>
      <DatePicker selected={dateValue} onChange={handleDateChange} dateFormat="yyyy-MM-dd"  />

      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent:"space-between" }}>
          <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)', transition: 'background-color 0.3s ease-in-out' }}>
        submit
      </button>
      <button onClick={()=>onClose()} style={{ padding: '10px 20px', fontSize: '16px', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)', transition: 'background-color 0.3s ease-in-out' }}>
        close
      </button>
      </div>
    </div>
    </div>
  );
};
