const CollapsibleSection = ({ title, isOpen, onToggle, children }) => (
  <>
    <h3 className="section-toggle" onClick={onToggle}>
      {title} {isOpen ? "▲" : "▼"}
    </h3>
    <div className={`collapsible ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  </>
);   


export default CollapsibleSection