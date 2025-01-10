import { useState } from "react";
import { useFocus } from "../context/FocusContext";
import "../../styles/Navbar.scss";

export function Navbar() {
  const { actions, canInteract } = useFocus();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a href="/" className="name">
          Matt Camerato
        </a>

        <div className="nav-container">
          <button
            className={`menu-button ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <div
              onClick={() => {
                //check if actions map
                if (actions.has("focus-monitor2") && canInteract) {
                  setIsMenuOpen(false);
                  actions.get("focus-monitor2")!();
                }
              }}
            >
              About
            </div>
            <div
              onClick={() => {
                if (actions.has("focus-monitor1") && canInteract) {
                  setIsMenuOpen(false);
                  actions.get("focus-monitor1")!();
                }
              }}
            >
              Projects
            </div>
            <div
              onClick={() => {
                if (actions.has("focus-envelope") && canInteract) {
                  setIsMenuOpen(false);
                  actions.get("focus-envelope")!();
                }
              }}
            >
              Contact
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
