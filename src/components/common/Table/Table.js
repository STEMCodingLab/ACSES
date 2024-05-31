 const Table = ({data,handleUpdate, handleDelete}) => {
 


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
            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' ,width:'300px' }}>
            <button 
    style={{ 
      backgroundColor: '#f44336', 
      color: 'white', 
      padding: '10px 20px', 
      border: 'none', 
      borderRadius: '4px', 
      cursor: 'pointer', 
      marginRight: '10px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      transition: 'background-color 0.3s ease, transform 0.3s ease' 
    }} 
    onClick={() => handleDelete(item.id)}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
  >
    delete
  </button>
            {!item.status &&  
  <button 
    style={{ 
      backgroundColor: '#f44336', 
      color: 'white', 
      padding: '10px 20px', 
      border: 'none', 
      borderRadius: '4px', 
      cursor: 'pointer', 
      marginRight: '10px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      transition: 'background-color 0.3s ease, transform 0.3s ease' 
    }} 
    onClick={() => handleUpdate(item.id, true)}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
  >
    todo
  </button>
}

{item.status &&  
  <button 
    style={{ 
      backgroundColor: '#4caf50', 
      color: 'white', 
      padding: '10px 20px', 
      border: 'none', 
      borderRadius: '4px', 
      cursor: 'pointer', 
      marginRight: '10px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      transition: 'background-color 0.3s ease, transform 0.3s ease' 
    }} 
    onClick={() => handleUpdate(item.id, false)}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#388e3c'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#4caf50'}
    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
  >
    complete
  </button>
}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 
export default Table