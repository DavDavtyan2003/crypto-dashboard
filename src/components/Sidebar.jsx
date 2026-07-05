function Sidebar({ isOpen, onClose, activePage, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'journal', label: 'Journal', icon: '📋' },
  ];

  return (
    <>
      {/* Overlay behind sidebar */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      {/* Sidebar panel */}
      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Crypto Dashboard v1.0</span>
        </div>
      </div>
    </>
  );
}

export default Sidebar;