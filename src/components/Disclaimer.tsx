import React, { useState } from 'react'

type Props = {
  visible: boolean
  onAccept: () => void
}

export const Disclaimer: React.FC<Props> = ({ visible, onAccept }) => {
  const [checked, setChecked] = useState(false)

  if (!visible) return null

  return (
    <div className="disclaimer-overlay" role="dialog" aria-modal="true">
      <div className="disclaimer-modal">
        <h2>Disclaimer — Please Read</h2>
        <p>
          All processing in this app happens locally in your browser. Do not upload
          or open documents that contain highly sensitive personal data you are not
          comfortable keeping on your device. You are responsible for ensuring any
          document you process here does not violate privacy or legal requirements.
        </p>

        <label className="disclaimer-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>I understand and will only process non-sensitive files</span>
        </label>

        <div className="disclaimer-actions">
          <button
            className="btn-accept"
            disabled={!checked}
            onClick={() => {
              try {
                localStorage.setItem('pdf_toolkit_ack', 'true')
              } catch (e) {
                // ignore
              }
              onAccept()
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer
