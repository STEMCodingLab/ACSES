import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Program = () => {
  const [programs, setPrograms] = useState([]);
  const [grades, setGrades] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('Audience'); // default 'All'
  const [selectedFocusArea, setSelectedFocusArea] = useState('Focus Area');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch('https://vivid-bloom-0edc0dd8df.strapiapp.com/api/programs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.status === 401) {
        localStorage.removeItem('jwt'); // remove JWT
        navigate('/login'); // redirect to login page
        return;
      }
      return response.json();
    })
    .then(data => {
      const allGrades = Array.from(new Set(data.data.map(program => program.attributes.Audience).filter(audience => audience)));
      const allFocusAreas = Array.from(new Set(data.data.map(program => program.attributes.FocusArea).filter(focusArea => focusArea)));

      setGrades(['Audience', ...allGrades]);
      setFocusAreas(['Focus Area', ...allFocusAreas]);
    })
    .catch(error => console.error('Error fetching filter options:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    let url = 'https://vivid-bloom-0edc0dd8df.strapiapp.com/api/programs?populate=Cover';

    if (selectedGrade !== 'Audience') {
      url += `&filters[Audience][$eq]=${selectedGrade}`;
    }
    if (selectedFocusArea !== 'Focus Area') {
      url += `&filters[FocusArea][$eq]=${selectedFocusArea}`;
    }

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setPrograms(data.data);
    })
    .catch(error => console.error('Error fetching programs:', error));
  }, [selectedGrade, selectedFocusArea]);
  
  // parse Overview
  // const parseOverview = (overview) => {
  //   return overview.map((block) => {
  //     if (block.type === 'paragraph') {
  //       return block.children.map((child) => child.text).join('');
  //     }
  //     return '';
  //   }).join('\n');
  // };

  const navigate = useNavigate();


  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
  };

  const handleFocusAreaChange = (event) => {
    setSelectedFocusArea(event.target.value);
  };

  return (
    
    <div className="container mx-auto p-5 ">
             {/* Grade and FocusArea drop down*/}
        <div className="mb-4 flex">
          <div className="border border-gray-300 rounded mr-4">
          <select value={selectedGrade} onChange={handleGradeChange} className="p-2 mr-2">
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          </div>
          <div className="border border-gray-300 rounded">
          <select value={selectedFocusArea} onChange={handleFocusAreaChange} className="p-2 mr-2">
            {focusAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          </div>
        </div>
      <h1 className="text-2xl font-semibold mb-6">Resources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[185px]" >
      {programs.map(program => (
        <Link to={`/programs/${program.id}`} key={program.id}
          className="flex bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-300 ease-in-out overflow-hidden" 
              style={{ height: '100px' }}>
          <div className="p-3 flex flex-col justify-between" style={{ width: '66.66%' }}>
            <h2 className="font-medium text-sm">{program.attributes.Title}</h2>
            <p className="text-xs">{program.attributes.Description}</p>
          </div>
          {program.attributes.Cover.data && (
            <div className="w-1/3">
              <img
                className="object-cover h-full w-full"
                src={`${program.attributes.Cover.data.attributes.url}`}
                alt={program.attributes.Title}
              />
            </div>
          )}
        </Link>
      ))}
      </div>
    </div>
  );
  
  
}
