import CreateEvent from "../../components/crud/CreateEvent";
import UpdateEvent from "../../components/crud/UpdateEvent";
import DeleteEvent from "../../components/crud/DeleteEvent";
import GetEventByID from "../../components/crud/GetEventByID";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrudPage.css"; // ייבוא של קובץ ה-CSS

const CrudPage = () => {
  return (
    <div className="crud-page-container">
      <div className="crud-page-content">
        <h1>ניהול אירועים</h1>
        <ToastContainer />
        <CreateEvent />
        <GetEventByID />
        <UpdateEvent />
        <DeleteEvent />
      </div>
    </div>
  );
};

export default CrudPage;
