import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GoChevronRight, GoChevronDown } from "react-icons/go";
import Comments from '../../../components/common/Comments/Comments';

export const ProgramDetail = () => {
  const [program, setProgram] = useState(null);
  const { programId } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [isWhatIncludedExpanded, setIsWhatIncludedExpanded] = useState(true);
  const [isSkillExpanded, setIsSkillExpanded] = useState(true);
  const [isCommentExpanded, setIsCommentExpanded] = useState(true);
  const [commentData, setCommentsData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All Tags');

  const transformData = (data) => {
    let transformedData = [];
    const replyMap = {};
    if (data.length <= 0) {
      return transformedData;
    }
    for (const comment of data) {
      const id = comment.id;
      const rid = comment.attributes.rid || 0;
      if (!replyMap[rid]) {
        replyMap[rid] = [];
      }
      replyMap[rid].push({
        id: id,
        uid: comment.attributes.uid,
        author: comment.attributes.author,
        content: comment.attributes.content,
        createdAt: comment.attributes.createdAt,
        updatedAt: comment.attributes.updatedAt,
        publishedAt: comment.attributes.publishedAt,
        img: comment.attributes.img,
      });
    }
    if (replyMap[0]) {
      transformedData = [...replyMap[0]];
      transformedData.forEach((comment) => {
        comment.reply = [];
        if (replyMap[comment.id]) {
          comment.reply = replyMap[comment.id];
        }
      });
    }
    return Object.values(transformedData);
  };

  const fetchCommentData = () => {
    const token = localStorage.getItem('jwt');
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/comments?populate=*&filters[pid][$eq]=${programId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCommentsData(transformData(data.data));
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/programs/${programId}?populate=Cover`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('jwt'); // remove JWT
          navigate('/login'); // redirect to login page
          return;
        }
        return response.json();
      })
      .then((data) => {
        setProgram(data.data);
      })
      .catch((error) => console.error('Error fetching program details:', error));

    fetchCommentData();
  }, [programId, navigate]);

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

      const allTags = Array.from(new Set(sortedSessions.flatMap(session => session.attributes.Tags ? session.attributes.Tags.split(',').map(tag => tag.trim()) : [])));
      setTags(['All Tags', ...allTags]);
    })
    .catch(error => console.error('Error fetching sessions:', error));
  }, [programId]);

  if (!program) {
    return <div>Loading...</div>;
  }

  const breadcrumbs = [
    { name: 'Programs', link: '/' },
    { name: program.attributes.Title, link: `/programs/${programId}` },
  ];

  const parseOverview = (overview) => {
    if (!overview) return <p>No overview available.</p>;
    return overview.map((block, index) => {
      if (block.type === 'paragraph') {
        return <p key={index}>{block.children.map((child) => child.text).join('')}</p>;
      }
      return null;
    });
  };

  const parseWhatIncluded = (whatIncluded) => {
    if (!whatIncluded) return <p>No What's Included available.</p>;
    return whatIncluded.map((block, index) => {
      if (block.type === 'paragraph') {
        return <p key={index}>{block.children.map((child) => child.text).join('')}</p>;
      }
      if (block.type === 'list' && block.format === 'unordered') {
        return (
          <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '1em' }}>
            {block.children.map((listItem, listItemIndex) => (
              <li key={listItemIndex}>
                {listItem.children.map((child) => child.text)}
              </li>
            ))}
          </ul>
        );
      }
      return null;
    });
  };

  const parseSkill = (skill) => {
    if (!skill) return <p>No skill available.</p>;
    return skill.map((skill, index) => {
      if (skill.type === 'heading') {
        const Tag = `h${skill.level}`;
        return <Tag key={index} style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 20, marginTop: 20 }}>{skill.children.map((child) => child.text).join('')}</Tag>;
      }
      if (skill.type === 'paragraph') {
        return (
          <p key={index}>
            {skill.children.map((child, childIndex) => (
              child.bold ? <strong key={childIndex}>{child.text}</strong> : <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        );
      }
      if (skill.type === 'list' && skill.format === 'unordered') {
        return (
          <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '1em' }}>
            {skill.children.map((listItem, listItemIndex) => (
              <li key={listItemIndex}>
                {listItem.children.map((child) => child.text)}
              </li>
            ))}
          </ul>
        );
      }
      return null;
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleOverview = () => {
    setIsOverviewExpanded(!isOverviewExpanded);
  };

  const toggleWhatIncluded = () => {
    setIsWhatIncludedExpanded(!isWhatIncludedExpanded);
  };

  const toggleSkills = () => {
    setIsSkillExpanded(!isSkillExpanded);
  };

  const toggleComments = () => {
    setIsCommentExpanded(!isCommentExpanded);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const filteredSessions = selectedTag === 'All Tags'
    ? sessions
    : sessions.filter(session => session.attributes.Tags && session.attributes.Tags.split(',').map(tag => tag.trim()).includes(selectedTag));

  return (
    <div className="container mx-auto">
      <nav aria-label="breadcrumb" className="pt-4">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index !== 0 && <GoChevronRight />}
              <li className={`flex items-center ${index === 0 ? 'text-indigo-600 hover:text-indigo-700 hover:underline' : 'font-medium'}`}>
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
      <div className="w-full bg-[#ffffff] flex container" style={{ margin: 'auto', borderRadius: 20, overflow: 'hidden', marginTop: 20, marginBottom: 20 }}>
        <div className="bg-[#ffffff] w-2/3">
          <div style={{ borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div className="mb-5">
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center w-full">
                  <button
                    onClick={toggleOverview}
                    className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
                  >
                    <div className="flex items-center">
                      {isOverviewExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                      <span>Program Overview</span>
                    </div>
                  </button>
                </div>
                {isOverviewExpanded && (
                  <p className="text-gray-600 text-left w-full pl-8">
                    {parseOverview(program.attributes.Overview)}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-5">
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center w-full">
                  <button
                    onClick={toggleWhatIncluded}
                    className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
                  >
                    <div className="flex items-center">
                      {isWhatIncludedExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                      <span>What's Included</span>
                    </div>
                  </button>
                </div>
                {isWhatIncludedExpanded && (
                  <p className="text-gray-600 text-left w-full pl-8">
                    {parseWhatIncluded(program.attributes.WhatIncluded)}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center w-full">
                <button
                  onClick={toggleExpand}
                  className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
                >
                  <div className="flex items-center">
                    {isExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                    <span>Sessions</span>
                  </div>
                </button>
              </div>
              {isExpanded && (
                <div className="mb-4">
                  <div className="border border-gray-300 rounded w-1/6 flex flex-center ml-7">
                    <select value={selectedTag} onChange={handleTagChange} className="p-2">
                      {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-[#ffffff] overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                      <li className="px-6 py-4">
                        <div className="flex justify-between">
                          <div className="w-2/3 text-sm font-medium text-gray-500 text-left">Title</div>
                          <div className="w-1/3 text-sm font-medium text-gray-500 text-center">Duration</div>
                          {/* <div className="w-1/4 text-sm font-medium text-gray-500 text-right">Tag</div> */}
                        </div>
                      </li>
                      {filteredSessions.map(session => (
                        <li key={session.id} className="px-6 py-4 mb-2 transition duration-300 ease-in-out hover:shadow-lg hover:border-transparent border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="w-1/2 text-sm font-medium">
                              <Link 
                                to={`/programs/${programId}/sessions/${session.id}`}
                                state={{
                                  programId: programId,
                                  programTitle: session.attributes.program.data.attributes.Title,
                                  sessionTitle: session.attributes.Title
                                }}
                                className="text-[#1da0db]"
                              >
                                {session.attributes.Title}
                              </Link>
                            </div>
                            <div className="w-1/3 text-sm font-medium text-gray-500 text-center">{session.attributes.Duration}</div>
                            {/* <div className="w-1/4 text-sm font-medium text-gray-500 text-right">
                              {session.attributes.Tags ? (
                                session.attributes.Tags.split(',').map((tag, index) => (
                                  <span key={index} >
                                    {tag.trim()}
                                  </span>
                                ))
                              ) : (
                                <span>No tags</span>
                              )}
                            </div> */}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-5">
              <button
                onClick={toggleComments}
                className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
              >
                {isCommentExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                <span>Comments</span>
              </button>
              {isCommentExpanded && (
                <ul className="list-disc mt-2 ml-8 text-gray-700" style={{ fontSize: '14px' }}>
                  <Comments commentData={commentData} fetchCommentData={fetchCommentData} />
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-1/3 mr-20 ml-30">
          <div className="p-4 my-4 rounded-lg shadow bg-[#ffffff] ml-30" style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="mb-2">
              <button
                onClick={toggleSkills}
                className="text-lg flex items-center justify-start w-full"
                style={{ fontSize: '14px' }}
              >
                {isSkillExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                <span>Skills</span>
              </button>
              {isSkillExpanded && (
                <ul className="list-disc mt-2 ml-8 text-gray-700" style={{ fontSize: '14px' }}>
                  {parseSkill(program.attributes.Skill)}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
