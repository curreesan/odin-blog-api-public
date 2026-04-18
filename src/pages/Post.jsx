import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import "../styles/pages/Post.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function Post() {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/posts/${id}`);
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to load post");

        setPost(data.post || data);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to post comment");

      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await fetch(`${BASE_URL}/api/posts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/posts/${id}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: editContent.trim() }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, comment: editContent.trim() } : c,
        ),
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <h2 className="loading">Loading post...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;
  if (!post) return <h2>Post not found</h2>;

  const isOwnComment = (comment) => user && comment.author?.id === user.user;
  const isPostAuthor = user && post.author?.id === user.user;

  return (
    <div className="post-page">
      <div className="post-container">
        <div className="post-grid">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          <div className="post-meta">
            <div className="meta-left">
              <span>By {post.author?.username || "Anonymous"}</span>
              <span className="date">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <hr />

        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-row">
                    <div className="comment-left">
                      <strong>{comment.author?.username || "User"}</strong>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="comment-right">
                      {isOwnComment(comment) && (
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.comment);
                          }}
                          className="edit-comment-btn"
                        >
                          Edit
                        </button>
                      )}
                      {(isOwnComment(comment) || isPostAuthor) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="delete-comment-btn"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="edit-form">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="3"
                      />
                      <div className="edit-actions">
                        <button onClick={() => handleEditComment(comment.id)}>
                          Save
                        </button>
                        <button onClick={() => setEditingCommentId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-content">{comment.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {token ? (
            <form onSubmit={handleSubmitComment} className="comment-form-grid">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="4"
                required
              />
              <button type="submit" disabled={submitting || !newComment.trim()}>
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to leave a comment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
