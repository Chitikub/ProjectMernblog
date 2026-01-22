import { forwardRef, useRef, useImperativeHandle } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
const Editor = forwardRef(({ value, onChange }, ref) => {
  const quillRef = useRef(null);
  useImperativeHandle(ref, () => {
    getQuill: () => {
      return quillRef.current.getEditor();
    };
  });

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  const modules = {
    toolbar: toolbarOptions,
  };
  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      modules={modules}
      //   formats={formats}
      onChange={onChange}
      className="h-48"
    />
  );
});

export default Editor;