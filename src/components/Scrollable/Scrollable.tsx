import Scrollbars from "@layerhub-io/react-custom-scrollbar"
import React from "react"

export default function ({ children, autoHide }: { children: React.ReactNode; autoHide?: boolean }) {
  const handleUpdate = (values: any) => {
    // Handle the scrollbar update event
    console.log("Scrollbar updated:", values)

  }

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div style={{ height: "100%", width: "100%", position: "absolute", overflow: "hidden" }}>
        <Scrollbars autoHide={autoHide} onUpdate={handleUpdate}>
          {children}
        </Scrollbars>
      </div>
    </div>
  )
}
