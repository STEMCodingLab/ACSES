import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Session = ({ programId }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/sessions?populate=*&filters[program][id][$eq]=${programId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
     const sortedSessions = data.data.sort((a, b) => a.id - b.id);
      setSessions(sortedSessions);
    })
    .catch(error => console.error('Error fetching sessions:', error));
  }, [programId]);

    return (
      <div>
        {sessions && sessions.length > 0 ? (
          sessions.map(session => (
            <div
              key={session.id}
              className="px-6 py-4 mb-2 transition duration-300 ease-in-out hover:shadow-lg hover:border-transparent border-b border-gray-200"
            >
              <li className="flex justify-between items-center">
              <div className="w-1/3 text-sm font-medium text-blue-500">
                <Link 
                  to={`/programs/${programId}/sessions/${session.id}`}
                  state={{
                    programId: programId,
                    programTitle: session.attributes.program.data.attributes.Title,
                    sessionTitle: session.attributes.Title
                  }}
                >
                  {session.attributes.Title}
                </Link>
              </div>
                <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">{session.attributes.Duration}</div>
                <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">
                  {session.attributes.Tags ? (
                    session.attributes.Tags.split(',').map((tag, index) => (
                      <span key={index} >
                        {tag.trim()}
                      </span>
                    ))
                  ) : (
                    <span>No tags</span>
                  )}
                </div>
              </li>
            </div>
          ))
        ) : (
          <p>No sessions available.</p>
        )}
      </div>
    );    
};
