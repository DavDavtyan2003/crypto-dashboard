import { useEffect } from 'react';

function AnalysisModal({ symbol, analysis, loading, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">AI Analysis — {symbol}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="spinner" />
              <span>Analyzing market data...</span>
            </div>
          ) : (
            <div className="modal-content">{analysis}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalysisModal;