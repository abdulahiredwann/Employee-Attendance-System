import { useParams } from "react-router-dom";

function ShowDetails() {
  const { id } = useParams();
  return (
    <>
      <h1>{id}</h1>
    </>
  );
}

export default ShowDetails;
