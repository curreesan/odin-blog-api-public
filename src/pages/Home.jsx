import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Home.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/posts`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch posts");
        }

        // Filter only PUBLISHED posts (or adjust according to your backend)
        const publishedPosts = data.posts
          ? data.posts.filter((post) => post.status === "PUBLISHED")
          : [];

        setPosts(publishedPosts);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const handleReadMore = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (loading) return <h2 className="loading">Loading posts...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Our Blog</h1>
        <p>Discover insightful articles and stories from talented authors</p>
      </div>

      {posts.length === 0 ? (
        <p className="no-posts">No published posts available yet.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-content">{post.content?.substring(0, 280)}</p>

              <div className="post-meta">
                <div className="meta-left">
                  <span className="author">
                    By {post.author?.username || "Anonymous"}
                  </span>
                  <span className="date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => handleReadMore(post.id)}
                  className="read-more-btn"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
