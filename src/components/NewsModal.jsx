import { useEffect } from 'react';

function NewsModal({ symbol, news, loading, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel modal-panel--news" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Latest News — {symbol}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="spinner" />
              <span>Fetching latest news...</span>
            </div>
          ) : news && news.length > 0 ? (
            <div className="news-list">
              {news.map((item, index) => (
                
                <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="news-item">
                  <div className="news-item-header">
                    <span className="news-source">{item.source}</span>
                    <span className="news-date">{formatDate(item.publishedAt)}</span>
                  </div>
                  <div className="news-title">{item.title}</div>
                  {item.description && (
                    <div className="news-description">
                      {item.description.slice(0, 120)}...
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div style={{ color: '#555', textAlign: 'center', padding: '24px' }}>
              No news found for {symbol}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsModal;