import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// 评论组件
const Comment = ({ comment, onSetComment,onDeleteComment }) => {
  const user=JSON.parse(localStorage.getItem('user'));
  console.log(comment);
  const isCurrentUser=(uid)=>{
    console.log(user.id,uid);
    return user.id === uid;
  }
  return (
    <div className="py-2 border-b border-gray-300">
  {/* 一级评论 */}
  <div className="flex items-start justify-between" onClick={() => onSetComment(comment.id,comment.author)}>
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2"></div> {/* 头像 */}
      <div>
        <p className="text-gray-800 font-semibold">{comment.author}</p> {/* 评论者姓名 */}
        <p className="text-gray-500 ml-2">{comment.content}</p> {/* 评论内容 */}
      </div>
    </div>
    {isCurrentUser(comment.uid) && (
      <button onClick={() => onDeleteComment(comment.id)} className="text-red-500">Delete</button>
    )}
  </div>
  {/* 二级评论列表 */}
  <div className="ml-8 mt-2">
    {comment.reply.map((reply) => (
      <div key={reply.id} className="flex items-start justify-between border-l-2 pl-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2"></div> {/* 头像 */}
          <div>
            <p className="text-gray-600 font-semibold">{reply.author}</p> {/* 评论者姓名 */}
            <p className="text-gray-500 ml-2">{reply.content}</p> {/* 评论内容 */}
          </div>
        </div>
        {isCurrentUser(reply.uid) && (
          <button onClick={() => onDeleteComment(reply.id)} className="text-red-500">Delete</button>
        )}
      </div>
    ))}
  </div>
</div>)
};

// 评论组件
const Comments = ({ commentData, fetchCommentData }) => {
  const { programId } = useParams();
  const userName = JSON.parse(localStorage.getItem('user'))['username']
  const [commentID, setCommentID] = useState(0)
  const [newComment, setNewComment] = useState('');
  //   提交评论
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newCommentObject
    // 写一个正则匹配是否包含@以及:'@'+author+': '
    const regex = /@(.*?):\s/;
    if (newComment.trim() !== '') {
      const token = localStorage.getItem('jwt');
      const user = JSON.parse(localStorage.getItem('user'))
      if (commentID === 0 || !regex.test(newComment)) {
        // 回复题主
        newCommentObject = {
          author: userName, // 替换成当前用户的信息
          content: newComment,
          rid: 0,
          uid: user.id,
          pid: parseInt(programId),
        }
        console.log(newCommentObject, "回复题主");
      } else {
        // 剔除匹配的内容
        const content = newComment.replace(regex, '');
        newCommentObject = {
          author: userName,
          content: content,
          rid: commentID,
          uid: user.id,
          pid: parseInt(programId),
        };
        console.log("回复评论数据", newCommentObject);


      }

      const response = await axios.post('https://vivid-bloom-0edc0dd8df.strapiapp.com/api/comments', {
        data: newCommentObject
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      alert('Successfully');
      setNewComment('');
      fetchCommentData()



    }
  };
  const setComment = (commentID, author) => {
    console.log(commentID, author, "评论ID");
    setCommentID(commentID)
    setNewComment('@' + author + ': ')
  }
  // 删除评论
  const onDeleteComment = async (commentId) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.delete(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Comment deleted successfully');
      fetchCommentData()
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="flex flex-col w-full p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-600">Comments</h2>
      {/* 渲染一级评论 */}
      {commentData.map((comment) => (
        <Comment key={comment.id} comment={comment} onSetComment={setComment} onDeleteComment={onDeleteComment} />
      ))}
      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md resize-none"
          placeholder="Write your comment here..."
          required
        ></textarea>
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Comments;
