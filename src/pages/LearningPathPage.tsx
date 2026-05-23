import React from "react";
import "./LearningPathPage.css";

export const LearningPathPage: React.FC = () => {
  return (
    <div className="learning-path-page">
      <div className="learning-path-header">
        <span id="verified">
          <i>
            <img
              src="\learning-path\certificate_icon.svg"
              alt="Verified "
            ></img>
          </i>
          <i>CERTIFICATION PATH</i>
        </span>
        <div>Frontend Learning Path</div>
        <div>
          Master the art of building modern interfaces from core fundamentals to
          advanced DOM manipulation and performance debugging.
        </div>
      </div>
    </div>
  );
};

export default LearningPathPage;
