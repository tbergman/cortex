import React from 'react'
import { type, colors } from 'styles'

export default props => (
  <div>
    <label>{props.label}</label>
    <input placeholder={props.placeholder} />
    <style jsx>
      {`
      label {
        ${type.apercuS};
        color: ${colors.mostlyBlack};
        display: block;
        margin-bottom: 4px;
      }
      input {
        ${type.estebanM};
        color: ${colors.mostlyBlack};
        background-color: ${colors.dustyRose};
        border: 1px solid ${colors.coffee};
        outline: none;
        padding: 6px 8px;
        width: 100%;
      }
    `}
    </style>
  </div>
)
