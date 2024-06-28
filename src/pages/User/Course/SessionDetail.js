import React, { useState, useEffect } from 'react';
import { useParams, useLocation,Link } from 'react-router-dom';
import { Content } from './Content';
import { GoChevronRight } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";

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

  useEffect(() => {
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
  }, [sessionId]);

  const breadcrumbs = [
    { name: 'All Programs', link: '/' },
    { name: programTitle, link: `/programs/${programId}` }, // Program Title 
    { name: sessionTitle, link: `/programs/${programId}/sessions/${sessionId}` }, // Session Title 
  ];
 
  // Rendering list items recursively
  const renderListItems = (items) => {
    if(!items) return null;
    return items.map((item, index) => {
      if (item.type === 'list-item') {
        return <li key={index} style={{ listStyleType: 'disc', marginLeft: '20px' }}>{renderListItems(item.children)}</li>;
      }
      return item.text;
    });
  };

  // Render each item in the objectives (which may be a list or a paragraph)
  const renderObjectivesItem = (item) => {
    if (!item) return null;
    if (item.type === 'list') {
      return item.format === 'unordered' ? <ul style={{ paddingLeft: 0 }}>{renderListItems(item.children)}</ul>
                                         : <ol>{renderListItems(item.children)}</ol>;
    } else if (item.type === 'paragraph') {
      return <p>{item.children.map(child => child.text)}</p>;
    }
  };

  // render objectives
  const renderObjectives = (objectives) => {
    if (!objectives) return <p>No objectives available.</p>;
    if (!objectives) return <p>No objectives available.</p>; 
    return objectives.map((item, index) => renderObjectivesItem(item));
  };


  // parse and render overview
  const renderOverview = (overview) => {
    if (!overview) return <p>No overview available.</p>; 
    return overview.map((paragraph, index) => {
      return <p key={index}>{paragraph.children.map(child => child.text)}</p>;
    });
  };


  const renderDiscussionTopics = (discussionTopics) => {
    if (!discussionTopics) return <p>No discussion topics available.</p>;
    return discussionTopics.map((topic, index) => {
      // topic type
      if (topic.type === 'heading') {
        const HeadingTag = `h${topic.level}`; // Creates title tags based on level
        return <HeadingTag key={index}>{topic.children.map(child => child.text).join('')}</HeadingTag>;
      }
  
      // topic.type === 'paragraph'
      if (topic.type === 'paragraph') {
        return <p key={index}>{topic.children.map(child => child.text).join('')}</p>;
      }
  
      // topic.type === 'list' && topic.format === 'unordered'
      if (topic.type === 'list' && topic.format === 'unordered') {
        return (
          <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '1em' }}>
            {topic.children.map((listItem, listItemIndex) => (
              <li key={listItemIndex}>
                {listItem.children.map(child => child.text)}
              </li>
            ))}
          </ul>
        );
      }
  
      // otehr types of data
      return null;
    });
  };



  const renderActivities = (activities) => {
    if (!activities) return <p>No activities available.</p>;
    return activities.map((activity, index) => {
      // activity.type === 'paragraph'
      if (activity.type === 'paragraph') {
        return <p key={index}>{activity.children.map(child => child.text).join('')}</p>;
      }
  
      // activity.type === 'heading'
      if (activity.type === 'heading') {
        const HeadingTag = `h${activity.level}`; 
        return <HeadingTag key={index}>{activity.children.map(child => child.text).join('')}</HeadingTag>;
      }
  
      // other types of data if needed
      return null;
    });
  };


  const renderAlignment = (alignment) => {
    if (!alignment) return <p>No alignment available.</p>;
    return alignment.map((item, index) => {
      // item.type === 'paragraph'
      if (item.type === 'paragraph') {
        return (
          <p key={index}>
            {item.children.map((child, childIndex) => {
              // Check if text needs to be bolded
              return child.bold ? <strong key={childIndex}>{child.text}</strong> : <span key={childIndex}>{child.text}</span>;
            })}
          </p>
        );
      }
  
      // otehr types of data if needed
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
    setIsAlignmentExpanded(!isAlignmentExpanded); // switch status
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
        <ol className="flex leading-none text-indigo-600">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <li className={`${index === breadcrumbs.length - 1 ? 'font-medium' :'text-indigo-600 hover:text-indigo-700 hover:underline'} flex items-center`}>
                {index !== 0 && <GoChevronRight className="mx-2" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-500">{crumb.name}</span>
                ) : (
                  <Link to={crumb.link}>{crumb.name}</Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

 
    <div className="w-full bg-[#ffffff] flex container" style={{margin:"auto",borderRadius:20,overflow:"hidden",marginTop:20,marginBottom:20}}>
      
      {/* Here you can show more details of the content */}
      <div className="bg-[#ffffff] w-2/3" >
        <div style={{ borderRadius:10,padding:20,marginBottom:20 }}>
          
          <div>
            <div className="mb-5">
              <button 
                onClick={toggleOverview}
                className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
              >
                <div className="flex items-center">
                  {isOverviewExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />} {/* Add an expand/collapse indicator */}
                  <span>Session Overview</span>
                </div>
              </button>
              {isOverviewExpanded && ( // Renders content based on the isOverviewExpanded status condition.
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
                  {isDiscussionTopicsExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />} {/* Add an expand/collapse indicator */}
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
                  {isActivitiesExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />} {/* Add an expand/collapse indicator */}
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
                  {isResourcesExpanded ? <GoChevronDown className="mr-2" />  : <GoChevronRight className="mr-2" />} {/* Add an expand/collapse indicator */}
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



          {/* <Content sessionId={sessionId} /> */}

        </div>
      </div>

      <div className="bg-[#ffffff] w-1/3 mr-20 ml-30" >
        <div className="p-4 my-4 rounded-lg shadow bg-[#f6f6f6] ml-30" style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div className="mb-2">
            <button
              onClick={toggleObjective}
              className=" text-md  flex items-center justify-start w-full"
              style={{ fontSize: '14px' }} // fontsize
            >
              {isObjecitveExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
              <span>Objective</span>
            </button>
            {isObjecitveExpanded && (
              <ul className="list-disc mt-2 ml-8 text-gray-700" style={{ fontSize: '14px' }}> {/* font size */}
                {renderObjectives(session.attributes.Objectives)}
              </ul>
            )}
          </div>
        </div>



        <div className="p-4 my-4 rounded-lg shadow bg-[#f6f6f6] ml-30" style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div className="mb-2">
            <button 
              onClick={toggleAlignment}
              className=" text-lg  flex items-center justify-start w-full"
              style={{ fontSize: '14px' }} 
            >
              {isAlignmentExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />} {/* an expand/collapse indicator */}
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
