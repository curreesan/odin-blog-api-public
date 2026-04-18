import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import "../styles/pages/BecomeAuthor.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function BecomeAuthor() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleBecomeAuthor = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/become-author`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      alert(
        "You are now an author! Head to the author dashboard to start writing.",
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="become-author-container">
      <div className="become-author-card">
        <h1>Become an Author</h1>

        <div className="content">
          <p>Want to write and publish your own posts on this blog?</p>
          <p>
            Click below to upgrade your account to author status, then head to
            the author dashboard to start writing.
          </p>
        </div>

        <div className="actions">
          <button onClick={handleBecomeAuthor} className="become-btn">
            Become an Author
          </button>
          <a
            href="https://odin-blog-api-author.onrender.com/"
            target="_blank"
            rel="noreferrer"
            className="dashboard-link"
          >
            Go to Author Website →
          </a>
        </div>
      </div>
    </div>
  );
}

export default BecomeAuthor;
