import "./DocumentEditor.css";

export default function DocumentEditor() {
  return (
    <div className="editor-container">
      <div
        className="editor"
        contentEditable
        suppressContentEditableWarning
      >
        <h3>5 Confidentiality Obligation</h3>
        <p>The receiving party will hold the Confidential Information in confidence.</p>

        <h3>6 Limitation on Use</h3>
        <p>The receiving party may only use the Confidential Information...</p>
      </div>

      <div className="editor-footer">
        <span>Words: 2979</span>
        <span>Page: 2 of 12</span>
        <span>100%</span>
      </div>
    </div>
  );
}
