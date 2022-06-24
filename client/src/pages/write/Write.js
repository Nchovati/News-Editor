import { useContext, useState, useEffect } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import { useLocation } from "react-router";
import { convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  const [dropdown, setDropdown] = useState("Edit");
  const [editorState, setEditorState] = useState("");
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();


  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/posts" + search);
      console.log(res.data)
      setPosts(res.data);
    };
    fetchPosts();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
      categories: dropdown
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) { }
    }
    try {
      const res = await axios.post("/posts", newPost);
      window.location.replace("/post/" + res.data.title);
    } catch (err) { }
  };
  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={e => setTitle(e.target.value)}
          />

        </div>
        <div classname="dropdown">
          <select class="dropbtn" value={dropdown} onChange={(e) => { setDropdown(e.target.value) }}>
            <option value="Edit">Edit</option>
            <option value="Draft">Draft</option>
            <option value="Publish">Publish</option>
          </select>
        </div>
        <div className="writeFormGroup">
          <h3>Story..</h3>
          <Editor
            editorState={editorState}
            wrapperClassName="card"
            editorClassName="card-body"
            onEditorStateChange={newState => {
              setEditorState(newState);
              setDesc(draftToHtml(convertToRaw(newState.getCurrentContent())));
            }}
            toolbar={{
              options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history', 'embedded', 'emoji', 'image'],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
            }}
          />

        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
