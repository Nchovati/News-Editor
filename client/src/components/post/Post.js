import "./post.css";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const PF = "http://localhost:32/images/";
  const display_title = post.title;
  post.title = post.title.replace("-", "~");
  return (
    <div className="post">
      {post.photo && <img className="postImg" src={PF + post.photo} alt="" />}
      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((c) => (
            <span className="postCat">{c.name}</span>
          ))}
        </div>
        <Link to={`/post/${post.title.replace(/ /g, "-")}`} className="link">
          <span className="postTitle">{display_title}</span>
        </Link>
        <hr />
        <span className="postDate">
          {new Date(post.createdAt).toDateString()}
        </span>
      </div>
      <p className="postDesc"><div
        dangerouslySetInnerHTML={{
          __html: post.desc
        }}
      /></p>
    </div>
  );
}
