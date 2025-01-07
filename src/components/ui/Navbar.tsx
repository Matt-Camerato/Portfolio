import { useState } from "react";
import { useOverlay } from "../context/OverlayContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { actions, isOpen } = useOverlay();

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
                if (isOpen) return;
                setIsMenuOpen(false);
                actions?.about?.();
              }}
            >
              About
            </div>
            <div
              onClick={() => {
                if (isOpen) return;
                setIsMenuOpen(false);
                actions?.projects?.();
              }}
            >
              Projects
            </div>
            <div
              onClick={() => {
                if (isOpen) return;
                setIsMenuOpen(false);
                actions?.contact?.();
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
