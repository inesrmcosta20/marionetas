
import './SideTab.css';

function SideTab({ 
  icon, 
  title, 
  isOpen, 
  onToggle, 
  children, 
  itemCount = 0,
  position = 'left',
  panelId // ← NOVO: Recebe identificador do painel
}) {
  
  const handleToggle = (e) => {
    // Previne comportamentos indesejados em multitouch
    if (e.type === 'touchstart') {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log(`📂 [${panelId || 'SideTab'}] Tab toggled: ${title}, was open: ${isOpen}`);
    onToggle();
  };

  return (
    <div 
      className={`side-tab side-tab-${position} ${isOpen ? 'side-tab-open' : ''}`}
      data-panel-id={panelId}
    >
      {/* Tab Trigger */}
      <div 
        className="side-tab-trigger"
        onClick={handleToggle}
        onTouchStart={handleToggle} // ← Suporte a touch
        title={title}
        data-tab-title={title}
        data-panel-id={panelId}
      >
        <div className="tab-icon">
          {icon}
        </div>
        {itemCount > 0 && (
          <div className="tab-badge">
            {itemCount}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="side-tab-content">
        <div className="tab-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SideTab;
