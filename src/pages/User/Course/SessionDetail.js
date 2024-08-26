import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Content } from './Content';
import { GoChevronRight, GoChevronDown } from "react-icons/go";

export const SessionDetail = () => {
  const [session, setSession] = useState(null);
  const { sessionId } = useParams();
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [isDiscussionTopicsExpanded, setIsDiscussionTopicsExpanded] = useState(true);
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(true);
  const [isObjecitveExpanded, setIsObjectiveExpanded] = useState(true);
  const [isAlignmentExpanded, setIsAlignmentExpanded] = useState(true);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(true);
  const location = useLocation();
  const { programId, programTitle, sessionTitle } = location.state;

  const fetchSessionData = useCallback(() => {
    const token = localStorage.getItem('jwt');
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setSession(data.data);
    })
    .catch(error => console.error('Error fetching session details:', error));
  }, [sessionId]); // Memoize the function and include `sessionId` as a dependency

  useEffect(() => {
    fetchSessionData(); // Fetch session data when the component mounts or sessionId changes
  }, [fetchSessionData]);

  const breadcrumbs = [
    { name: 'Programs', link: '/' },
    { name: programTitle, link: `/programs/${programId}` }, // Program Title 
    { name: sessionTitle, link: `/programs/${programId}/sessions/${sessionId}` }, // Session Title 
  ];
 
  // Rendering list items recursively
  const renderListItems = (items) => {
    if (!items) return null;
    return items.map((item, index) => {
      if (item.type === 'list-item') {
        return (
          <li key={index} style={{ listStyleType: 'disc', marginLeft: '20px' }}>
            {renderListItems(item.children)}
          </li>
        );
      }
      return item.text;
    });
  };

  // Render each item in the objectives (which may be a list or a paragraph)
  const renderObjectivesItem = (item, index) => {
    if (!item) return null;
    if (item.type === 'list') {
      return item.format === 'unordered' ? (
        <ul key={index} style={{ paddingLeft: 0 }}>
          {renderListItems(item.children)}
        </ul>
      ) : (
        <ol key={index}>
          {renderListItems(item.children)}
        </ol>
      );
    } else if (item.type === 'paragraph') {
      return <p key={index}>{item.children.map((child, childIndex) => child.text)}</p>;
    }
  };

  // render objectives
  const renderObjectives = (objectives) => {
    if (!objectives) return <p>No objectives available.</p>;
    return objectives.map((item, index) => renderObjectivesItem(item, index));
  };

  // parse and render overview
  const renderOverview = (overview) => {
    if (!overview) return <p>No overview available.</p>; 
    return overview.map((paragraph, index) => (
      <p key={index}>
        {paragraph.children.map((child, childIndex) => child.text)}
      </p>
    ));
  };

  const renderDiscussionTopics = (discussionTopics) => {
    if (!discussionTopics) return <p>No discussion topics available.</p>;
    return discussionTopics.map((topic, index) => {
      if (topic.type === 'heading') {
        const HeadingTag = `h${topic.level}`;
        return <HeadingTag key={index}>{topic.children.map((child) => child.text).join('')}</HeadingTag>;
      }

      if (topic.type === 'paragraph') {
        return <p key={index}>{topic.children.map((child) => child.text).join('')}</p>;
      }

      if (topic.type === 'list' && topic.format === 'unordered') {
        return (
          <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '1em' }}>
            {topic.children.map((listItem, listItemIndex) => (
              <li key={listItemIndex}>
                {listItem.children.map((child, childIndex) => child.text)}
              </li>
            ))}
          </ul>
        );
      }

      return null;
    });
  };

  const renderActivities = (activities) => {
    if (!activities) return <p>No activities available.</p>;
    return activities.map((activity, index) => {
      if (activity.type === 'paragraph') {
        return <p key={index}>{activity.children.map((child) => child.text).join('')}</p>;
      }

      if (activity.type === 'heading') {
        const HeadingTag = `h${activity.level}`; 
        return <HeadingTag key={index}>{activity.children.map((child) => child.text).join('')}</HeadingTag>;
      }

      return null;
    });
  };

  const renderAlignment = (alignment) => {
    if (!alignment) return <p>No alignment available.</p>;
    return alignment.map((item, index) => {
      if (item.type === 'paragraph') {
        return (
          <p key={index}>
            {item.children.map((child, childIndex) => {
              return child.bold ? <strong key={childIndex}>{child.text}</strong> : <span key={childIndex}>{child.text}</span>;
            })}
          </p>
        );
      }

      return null;
    });
  };

  const toggleOverview = () => {
    setIsOverviewExpanded(!isOverviewExpanded);
  };

  const toggleDiscussionTopics = () => {
    setIsDiscussionTopicsExpanded(!isDiscussionTopicsExpanded);
  };

  const toggleActivitiesTopics = () => {
    setIsActivitiesExpanded(!isActivitiesExpanded);
  };

  const toggleObjective = () => {
    setIsObjectiveExpanded(!isObjecitveExpanded);
  };

  const toggleAlignment = () => {
    setIsAlignmentExpanded(!isAlignmentExpanded);
  };

  const toggleResources = () => {
    setIsResourcesExpanded(!isResourcesExpanded);
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <nav aria-label="breadcrumb" className="pt-4">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <li className={`flex items-center ${index === breadcrumbs.length - 1 ? 'font-medium' :'text-indigo-600 hover:text-indigo-700 hover:underline'}`}>
                {index !== 0 && <GoChevronRight className="mx-2 text-gray-500" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-500">{crumb.name}</span>
                ) : (
                  <Link to={crumb.link} className="text-[#1da0db] hover:text-[#1da0db] hover:underline">{crumb.name}</Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <div className="w-full bg-[#ffffff] flex container" style={{ margin: "auto", borderRadius: 20, overflow: "hidden", marginTop: 20, marginBottom: 20 }}>
        <div className="bg-[#ffffff] w-2/3">
          <div style={{ borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div>
              <div className="mb-5">
                <button 
                  onClick={toggleOverview}
                  className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
                >
                  <div className="flex items-center">
                    {isOverviewExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />}
                    <span>Session Overview</span>
                  </div>
                </button>
                {isOverviewExpanded && (
                  <div className="text-gray-600 text-left w-full pl-8">
                    {renderOverview(session.attributes.Overview)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-5">
                <button 
                  onClick={toggleDiscussionTopics}
                  className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
                >
                  <div className="flex items-center">
                    {isDiscussionTopicsExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />}
                    <span>Discussion Topics</span>
                  </div>
                </button>
                {isDiscussionTopicsExpanded && ( 
                  <div className="text-gray-600 text-left w-full pl-8">
                    {renderDiscussionTopics(session.attributes.DiscussionTopics)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-5">
                <button 
                  onClick={toggleActivitiesTopics}
                  className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
                >
                  <div className="flex items-center">
                    {isActivitiesExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />}
                    <span>Activities</span>
                  </div>
                </button>
                {isActivitiesExpanded && ( 
                  <div className="text-gray-600 text-left w-full pl-8">
                    {renderActivities(session.attributes.Activities)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-5">
                <button 
                  onClick={toggleResources}
                  className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
                >
                  <div className="flex items-center">
                    {isResourcesExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />}
                    <span>Resources</span>
                  </div>
                </button>
                {isResourcesExpanded && ( 
                  <div>
                    <Content sessionId={sessionId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#ffffff] w-1/3 mr-20 ml-30">
          <div className="p-4 my-4 rounded-lg shadow bg-[#def1fa] ml-30" style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="mb-2">
              <button
                onClick={toggleObjective}
                className="text-md flex items-center justify-start w-full"
                style={{ fontSize: '14px' }}
              >
                {isObjecitveExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                <span>Objective</span>
              </button>
              {isObjecitveExpanded && (
                <ul className="list-disc mt-2 ml-8 text-gray-700" style={{ fontSize: '14px' }}>
                  {renderObjectives(session.attributes.Objectives)}
                </ul>
              )}
            </div>
          </div>

          <div className="p-4 my-4 rounded-lg shadow bg-[#def1fa] ml-30" style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="mb-2">
              <button 
                onClick={toggleAlignment}
                className="text-lg flex items-center justify-start w-full"
                style={{ fontSize: '14px' }} 
              >
                {isAlignmentExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                <span>Alignment</span>
              </button>
              {isAlignmentExpanded && (
                <ul className="list-disc mt-2 ml-8 text-gray-700" style={{ fontSize: '14px' }}>
                  {renderAlignment(session.attributes.Alignment)}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
