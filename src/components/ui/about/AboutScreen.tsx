import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import { useFocus } from "../../context/FocusContext";
import { MatrixScreenSaver } from "../ScreenSaver";
import AboutPage from "./AboutPage";
import GamingPage from "./GamingPage";
import InterestsPage from "./InterestsPage";
import "../../../styles/AboutScreen.scss";

export function AboutScreen({
  isActive,
  backClicked,
  setBackClicked,
}: {
  isActive: boolean;
  backClicked: boolean;
  setBackClicked: (backClicked: boolean) => void;
}) {
  const { setInteractState } = useFocus();
  const [currentPage, setCurrentPage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const getPage = () => {
    switch (currentPage) {
      case "gaming":
        return <GamingPage />;
      case "interests":
        return <InterestsPage />;
      default:
        return <AboutPage setPage={setPage} />;
    }
  };

  const setPage = (page: string) => {
    setIsLoading(true);
    setCurrentPage(page);
  };

  const handleBack = () => {
    setIsLoading(true);
    setCurrentPage("");
  };

  useEffect(() => {
    if (backClicked) {
      handleBack();
      setBackClicked(false);
    }
  }, [backClicked]);

  useEffect(() => {
    if (!isActive && currentPage) {
      setCurrentPage("");
    } else {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isActive]);

  useEffect(() => {
    if (currentPage === "") setInteractState(1);
    else setInteractState(2);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [currentPage]);

  return isActive ? (
    <Html
      transform
      position={[0, 0.355, 0.001]}
      rotation={[0, 0, 0]}
      scale={[0.0275, 0.0275, 0.0275]}
      renderOrder={10}
    >
      <div className="about-screen">
        <img className="toolbar" src="/images/about/toolbar.png" />
        {currentPage !== "" && (
          <button className="back-button" onClick={handleBack}>
            ←
          </button>
        )}
        <div className={`page-loader ${!isLoading ? "fade-out" : ""}`}></div>
        {!isLoading && <div className="screen-content">{getPage()}</div>}
      </div>
    </Html>
  ) : (
    <MatrixScreenSaver
      position={new Vector3(0, 0.356, 0.1)}
      scale={new Vector3(0.0265, 0.026, 0.026)}
    />
  );
}
