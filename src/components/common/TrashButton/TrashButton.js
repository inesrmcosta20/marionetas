function TrashButton({ onDrop }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData && onDrop) {
      onDrop(itemData);
    }
  };

  return (
    <div 
      className="trash-button"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        width: '60px',
        height: '60px',
        background: '#dc3545',
        border: '2px solid #fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        fontSize: '24px'
      }}
      title="Drag items here to delete"
    >
      🗑️
    </div>
  );
}

export default TrashButton;