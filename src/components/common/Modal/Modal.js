import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
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
export default  Modal