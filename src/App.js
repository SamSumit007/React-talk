import './App.css';
import JSONdata from './data';
import { useState } from 'react';

import Comment from './components/Comment';
import NewComment from './components/NewComment';
import DeleteModal from './components/DeleteModal';
let currentId = 5; // ¯\_(ツ)_/¯

function App() {

  const [data, setData] = useState(JSONdata);
  const [deleteComment, setDeleteComment] = useState(false);
  
  const addNewReply = (id, body) => {
    if (!/\S/.test(body)) return;  // to avoid posting empty comments (only whitespaces)
    let temp = data;
    currentId += 1;
    for (let comment of temp.comments) {
        if (comment.id === id) {
        comment.replies.push({
          'id': currentId + 1,
          'body': body,
          'timestamp': 'Just now',
          'points': 0,
          'replyingTo': comment.user.author,
          'user': {...data.currentUser}
        });
        break;
      }
      if (comment.replies.length > 0) {
        for (let reply of comment.replies) {
          if (reply.id === id) {
            comment.replies.push({
              'id': currentId + 1,
              'body': body,
              'createdAt': 'Just now',
              'points': 0,
              'replyingTo': reply.user.author,
              'user': {...data.currentUser}
            });
            break;
          }
        }
      }
    }
    setData({...temp}); 
  }

  const updatepoints = (id, action) => {
    let temp = data;
    for (let comment of temp.comments) {
      if (comment.id === id){
        action === 'upvote' ? comment.points += 1 : comment.points -= 1;
        break;
      }
      if (comment.replies.length > 0) {
        for (let reply of comment.replies) {
          if (reply.id === id) {
            action === 'upvote' ? reply.points += 1 : reply.points -= 1;
            break;
          }
        }
      }
    }
    setData({...temp});
  }

  const updateComment = (updatedContent, id) => {
    let temp = data;
    for (let comment of temp.comments) {
      if (comment.id === id) {
        comment.body = updatedContent;
        break;
      } 
      if (comment.replies.length > 0) {
        for (let reply of comment.replies) {
          if (reply.id === id) {
            reply.content = updatedContent;
            break;
          }
        }
      }
    }
    setData({...temp});
  }

  const addNewComment = (body) => {
    if (!/\S/.test(body)) return;
    let temp = data;
    currentId += 1;
    temp.comments.push({
      'id': currentId + 1,
      'body': body,
      'timestamp': 'Just now',
      'points': 0,
      'user': {...data.currentUser},
      'replies': []
    });
    setData({...temp});
  }

  return (
    <>
    { deleteComment !== false &&
      <DeleteModal
      id={deleteComment}
      setDeleteComment={setDeleteComment}
      setData={setData}
      data={data}
      />
    }
    
    <main className='comments-column'>
      { data.comments.map((comment) => {
        return (
            <Comment
              replyingTo=''
              addNewReply={addNewReply}
              updateComment={updateComment}
              setDeleteComment={setDeleteComment}
              updatepoints={updatepoints}
              key={comment.id}  
              currentUser={data.currentUser}
              comment={comment.body}
              image={comment.user.image.png}
              author={comment.user.author}
              timeSince={comment.timestamp}
              points={comment.points}
              replies={comment.replies}
              id={comment.id}
            />
          )
      })
      }
      <NewComment
        addNewComment={addNewComment}
        currentUser={data.currentUser}
      />
    </main>
    </>
  );
}

export default App;
