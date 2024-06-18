import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// comment components
const Comment = ({ comment, onSetComment,onDeleteComment }) => {
  const user=JSON.parse(localStorage.getItem('user'));
  console.log(comment);
  const isCurrentUser=(uid)=>{
    console.log(user.id,uid);
    return user.id === uid;
  }
  return (
    <div className="py-2 border-b border-gray-300">
  {/* first level comment */}
  <div className="flex items-start justify-between" onClick={() => onSetComment(comment.id,comment.author)}>
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2">
        <img src={comment.img}/>
        </div> {/* avatar */}
      <div>
        <p className="text-gray-800 font-semibold">{comment.author}</p> {/* comment author */}
        <p className="text-gray-500 ml-2">{comment.content}</p> {/* comment content*/}
      </div>
    </div>
    {isCurrentUser(comment.uid) && (
      <button onClick={() => onDeleteComment(comment.id)} className="text-red-500">Delete</button>
    )}
  </div>
  {/* second level comment list */}
  <div className="ml-8 mt-2">
    {comment.reply.length>0&&comment.reply.map((reply) => (
      <div key={reply.id} className="flex items-start justify-between border-l-2 pl-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2"> <img src={reply.img}/></div> {/* avatar */}
          <div>
            <p className="text-gray-600 font-semibold">{reply.author}</p> {/* comment author */}
            <p className="text-gray-500 ml-2">{reply.content}</p> {/* comment content */}
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

// comment component
const Comments = ({ commentData, fetchCommentData }) => {
  const { programId } = useParams();
  const userName = JSON.parse(localStorage.getItem('user'))['username']
  const [commentID, setCommentID] = useState(0)
  const [newComment, setNewComment] = useState('');
  //   submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newCommentObject
    // regexp:'@'+author+': '
    const regex = /@(.*?):\s/;
    if (newComment.trim() !== '') {
      const token = localStorage.getItem('jwt');
      const user = JSON.parse(localStorage.getItem('user'))
      if (commentID === 0 || !regex.test(newComment)) {
        // reply first level comment
        newCommentObject = {
          author: userName, // replce to recent user info
          content: newComment,
          rid: 0,
          uid: user.id,
          pid: parseInt(programId),
          img:localStorage.getItem('Avatar')
        }
        console.log(newCommentObject, "reply");
      } else {
        // Eliminate matches
        const content = newComment.replace(regex, '');
        newCommentObject = {
          author: userName,
          content: content,
          rid: commentID,
          uid: user.id,
          pid: parseInt(programId),
          img:localStorage.getItem('Avatar')
        };
        console.log("reply to comment data", newCommentObject);


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
    console.log(commentID, author, "commentID");
    setCommentID(commentID)
    setNewComment('@' + author + ': ')
  }
  // delete comment
  const onDeleteComment = async (commentId) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.delete(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Comment deleted successfully');
      setNewComment('')
      fetchCommentData()
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      {/* render first level comment */}
       {commentData.length>0&&commentData.map((comment) => (
        <Comment key={comment.id} comment={comment} onSetComment={setComment} onDeleteComment={onDeleteComment} />
      ))}
      {/* input form */}
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
