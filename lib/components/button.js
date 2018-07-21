import React from 'react'
import { type, colors } from 'styles'

export default props => (
  <div>
    <button>{props.children}</button>
    <style jsx>
      {`
        button {
          ${type.apercuM};
          padding: 11px;
          color: white;
          background-color: ${colors.mostlyBlack};
          width: 100%;
          border: 0;
          outline: 0;
          cursor: pointer;
        }
      `}
    </style>
  </div>
)
