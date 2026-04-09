import React from 'react'

function Monitor(): React.JSX.Element {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    window.electron.ipcRenderer.send('show-context-menu')
  }

  return (
    <div 
      onContextMenu={handleContextMenu}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0f0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontSize: '24px'
      } as React.CSSProperties}
    >
      <div style={{ WebkitAppRegion: 'no-drag', cursor: 'pointer' } as React.CSSProperties} onClick={() => console.log('clicked')}>
        AAPL: $150.00 ▲
      </div>
    </div>
  )
}

export default Monitor