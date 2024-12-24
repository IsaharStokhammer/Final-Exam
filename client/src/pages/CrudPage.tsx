import CreateEvent from "../components/crud/CreateEvent";
import UpdateEvent from "../components/crud/UpdateEvent";
import DeleteEvent from "../components/crud/DeleteEvent";
import GetEventByID from "../components/crud/GetEventByID";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrudPage = () => {
  return (
    <div style={{ width: "100%", padding: "20px", textAlign: "center" }}>
      <h1>Terror Events CRUD</h1>
      <ToastContainer />
      <CreateEvent />
      <GetEventByID />
      <UpdateEvent />
      <DeleteEvent />
    </div>
  );
};

export default CrudPage;
