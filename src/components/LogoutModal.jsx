import "../styles/logoutModal.css";
import logo from "../assets/certicodeicon.png";

const LogoutModal = ({ onClose, onConfirm, isLoading = false }) => {
  return (
    <div className="modal-overlay">
      <div className="logout-modal">
        <img src={logo} alt="Certicode" className="modal-logo" />

        <h3>Log Out</h3>

        <p>
          Are you sure you want to log out of your session?
          <br />
          You will need to re-authenticate to access the admin panel.
        </p>

        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            className="logout-btn"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Logging out...
              </>
            ) : (
              "Log Out"
            )}
          </button>
        </div>

        <small className="modal-footer">
          Secure session management by CertiCode Systems
        </small>
      </div>
    </div>
  );
};

export default LogoutModal;
