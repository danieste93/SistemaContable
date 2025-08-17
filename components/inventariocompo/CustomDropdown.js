import React, { useRef,  } from 'react';

function CustomDropdown({ items }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = useRef(null);



  
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="custom-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
      <button className="contDropdown" style={{marginRight:"15px"}} onClick={e => { e.stopPropagation(); setOpen(!open); }}>
        <span className="material-icons">more_vert</span>
      </button>
      <div
        ref={menuRef}
        className={`custom-dropdown-menu${open ? ' open' : ''}`}
        style={{
          position: 'absolute', right: 0, top: '100%', zIndex: 999,
          background: '#fff', border: '1px solid #ccc', borderRadius: 8, minWidth: 180,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transform: open ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.25s, transform 0.25s',
        }}
      >
        {items.map(item => (
          <button
            key={item.key}
            className={item.className}
            style={{
              width: '100%',
              textAlign: 'left',
              margin: '4px 0',
              padding: '8px 12px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s, color 0.2s',
              background: 'none',
              color: '#222',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onClick={e => { item.onClick(e); setOpen(false); }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #e3e8ff 0%, #f0f4ff 100%)';
              e.currentTarget.style.color = '#1a237e';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#222';
            }}
          >
            <span className="material-icons" style={{fontSize:22}}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <style>{`
        .custom-dropdown-menu {
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .custom-dropdown-menu.open {
          animation: fadeInMenu 0.25s;
        }
        .custom-dropdown-menu button:hover {
          background: linear-gradient(90deg, #e3e8ff 0%, #f0f4ff 100%) !important;
          color: #1a237e !important;
        }
        .custom-dropdown-menu button {
          background: none;
          color: #222;
          border: none;
          font-weight: 500;
          cursor: pointer;
        }
        @keyframes fadeInMenu {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

}
  export default CustomDropdown;