import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Session } from './Session';
import { GoChevronRight } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import { useNavigate, Link } from 'react-router-dom';

import Comments from '../../../components/common/Comments/Comments';
export const ProgramDetail = () => {
  const [program, setProgram] = useState(null);
  const { programId } = useParams();
  const [isExpanded, setIsExpanded] = useState(true)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [isWhatIncludedExpanded, setIsWhatIncludedExpanded] = useState(true);
  const navigate = useNavigate();
  // 评论数据
  const [commentData, setCommentsData] = useState([]);
  // 创建一个函数来处理后退操作
  const goBack = () => {
    navigate(-1); // 后退
  };
  
const  transformData=(data)=> {
  
  let transformedData = [];
  
  // 构建回复映射表
  const replyMap = {};
  if(data.length<=0){

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
        publishedAt: comment.attributes.publishedAt
      });
    }
  
  transformedData=[...replyMap[0]]
  transformedData.forEach(comment => {
    comment.reply=[]
      if (replyMap[comment.id]) {
          comment.reply = replyMap[comment.id];
      }
  });

  return Object.values(transformedData);
}
// 获取评论数据
const fetchCommentData= ()=>{
  const token = localStorage.getItem('jwt');
  // 获取评论数据
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/comments?populate=*&filters[pid][$eq]=${programId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setCommentsData(transformData(data.data))
      console.log('Comments data:', transformData(data.data))
    })
}
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/programs/${programId}?populate=Cover,sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setProgram(data.data);
    })
    .catch(error => console.error('Error fetching program details:', error));
    
    fetchCommentData()
    
  }, [programId]);

  if (!program) {
    return <div>Loading...</div>;
  }

  // 简化的面包屑数组，您可以根据实际的路由结构进行调整
  const breadcrumbs = [
    { name: 'Programs', link: '/' },
    { name: program.attributes.Title, link: `/programs/${programId}` },
    // 假设您有更多的层级，可以继续添加
  ];
  
  const parseOverview = (overview) => {
    if (!overview) return <p>No overview available.</p>;
    return overview.map((block) => {
      if (block.type === 'paragraph') {
        return block.children.map((child) => child.text).join('');
      }
      return '';
    }).join('\n');
  };

  const parseWhatIncluded = (whatIncluded) => {
    if (!whatIncluded) return <p>No What's Included available.</p>;
    return whatIncluded.map(block => {
      // 对于段落类型
      if (block.type === 'paragraph') {
        return <p>{block.children.map(child => child.text).join('')}</p>;
      }
  
      // 对于无序列表类型
      if (block.type === 'list' && block.format === 'unordered') {
        return (
          <ul style={{ listStyleType: 'disc', paddingLeft: '1em' }}>
            {block.children.map(listItem => (
              <li key={listItem.children[0].text}>
                {listItem.children.map(child => child.text)}
              </li>
            ))}
          </ul>
        );
      }
  
      // 其他类型可以根据需要添加
    });
  };
  

  const parseSkill = (skill) => {
    if (!skill) return <p>No skill available.</p>;
    return skill.map((skill, index) => {
      // 对于标题类型
      if (skill.type === 'heading') {
        const Tag = `h${skill.level}`; // 根据 level 创建对应级别的标题标签
        return <Tag key={index} style={{fontSize:15,fontWeight:"bold",marginBottom:20,marginTop:20}}>{skill.children.map(child => child.text).join('')}</Tag>;
      }
  
      // 对于段落类型
      if (skill.type === 'paragraph') {
        return <p key={index}>{skill.children.map(child => child.text).join('')}</p>;
      }
  
      // 对于无序列表类型
      if (skill.type === 'list' && skill.format === 'unordered') {
        return (
          <ul key={index} style={{ listStyleType: 'disc', paddingLeft: '1em' }}>
            {skill.children.map((listItem, listItemIndex) => (
              <li key={listItemIndex} style={{marginTop:10}}>
                {listItem.children.map(child => child.text)}
              </li>
            ))}
          </ul>
        );
      }
  
      // 其他类型可以根据需要添加
      return null;
    });
  };
  
  


  const toggleExpand = () => { // Moved here
    setIsExpanded(!isExpanded);
  };

  const toggleOverview = () => {
    setIsOverviewExpanded(!isOverviewExpanded);
  };

  const toggleWhatIncluded = () => {
    setIsWhatIncludedExpanded(!isWhatIncludedExpanded);
  };

  return (
  <div className="container mx-auto">
    <nav aria-label="breadcrumb" className="pt-4">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <GoChevronRight />} {/* 在列表项前添加箭头 */}
            <li className={`flex items-center ${index === 0 ? 'text-indigo-600 hover:text-indigo-700 hover:underline': 'font-medium' }`}>
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
    {/* <div className="p-6">
      <button onClick={goBack} className="go-back-button">
        Go Back
      </button>
    </div> */}
    <div className="w-full bg-[#ffffff] flex container" style={{margin:"auto",borderRadius:20,overflow:"hidden",marginTop:20,marginBottom:20}}>
       
      <div className="bg-[#ffffff] w-2/3" >
        <div className="p-6">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center w-full">
              <button
                onClick={toggleOverview}
                className="w-full flex items-center justify-start text-xl text-gray-600 mb-4"
              >
                <div className="flex items-center">
                  {isOverviewExpanded ? <GoChevronDown className="mr-2" /> : <GoChevronRight className="mr-2" />}
                  <span>Overview</span>
                </div>
              </button>
            </div>
            {isOverviewExpanded && (
              <p className="text-gray-600 text-left w-full pl-8"> {/* Adjusted padding-left to align with 'Overview' */}
                {parseOverview(program.attributes.Overview)}
              </p>
            )}
          </div>
      </div>


      <div className="p-6">
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
            <p className="text-gray-600 text-left w-full pl-8"> {/* Adjusted padding-left to align with 'What's Included' */}
              {parseWhatIncluded(program.attributes.WhatIncluded)}
            </p>
          )}
        </div>
      </div>
        

        
      <div className="p-6">
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
          <div className="bg-[#ffffff] overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <div className="flex justify-between">
                  <div className="w-1/3 text-sm font-medium text-gray-500 text-left">Title</div>
                  <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">Duration</div>
                  <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">Tag</div>
                </div>
              </li>
              <li>

                  <Session programId={programId} />
                  
              </li>
            </ul>
          </div>
        )}

      </div>
                {/* 在 Sessions 下方添加评论页面 */}
<div>
  {/* 在这里添加你的评论组件 */}
  <Comments  commentData={commentData} fetchCommentData={fetchCommentData}/>
</div>
      </div>

      <div className="bg-[#F0F3FB] w-1/3"  style={{margin:20,borderRadius:20}}>
          <div className="p-6">
          <p style={{fontWeight:"bold",fontSize:20,marginBottom:20}}>Skills</p>
          {parseSkill(program.attributes.Skill)}
        </div>
      </div>
    </div>

    

  </div>
  );
};
