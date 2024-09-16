import { useParams } from "react-router-dom";

const NotePage = () => {
  const { noteId } = useParams();
  return <div>{noteId}</div>;
};

export default NotePage;
