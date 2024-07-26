import React, { useState, useEffect } from 'react';


import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
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
          id:item.id,
          status:item.attributes.status
        }
      })
      setNotesList(result)
    })
    .catch(error => console.error('Error fetching profile:', error));
  };
  // 提交
  const handleSubmit=async (data) => {

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
  // 修改
  const handleUpdate=async (id,status) => {
    const response = await axios.put(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/notes/${id}`, {
      data:{
        status
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
   
    getData(user.id)
  
  };
  // 
  const handleDelete=async (id)=>{
    const response = await axios.delete(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/notes/${id}`, 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    getData(user.id)
  }
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
        {/* can add more to show */}
          
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
        <Table data={notesList} handleUpdate={handleUpdate} handleDelete={handleDelete}></Table>
      </div>
      {showModel && (<Modal onSubmit={handleSubmit} onClose={() => setShowModel(false)}> </Modal>)}
      </div>
   
    </div>
  );
};





