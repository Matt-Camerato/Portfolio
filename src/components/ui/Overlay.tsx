import { useOverlay } from "../context/OverlayContext";
import { ContactForm } from "../ui/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRepeat } from "@fortawesome/free-solid-svg-icons";

import "../../styles/Overlay.scss";

export const Overlay = () => {
  const { isOpen, actions } = useOverlay();

  return (
    isOpen && (
      <div className="overlay">
        <ContactForm />
        {actions.close && (
          <button className="closeButton" onClick={actions.close}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        {actions.shuffle && (
          <button className="shuffleButton" onClick={actions.shuffle}>
            <FontAwesomeIcon icon={faRepeat} />
          </button>
        )}
      </div>
    )
  );
};
