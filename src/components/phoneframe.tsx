import React from "react";

type Props = {
  title: string;
  src: string;
};

export default function PhoneFrame({ title, src }: Props) {
  return (
    <div style={{
      width: 360, height: 640, border: "1px solid #DDD",
      borderRadius: 30, overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,.15)",
      background: "#000", position: "relative"
    }}>
      <div style={{
        position: "absolute", top: 8, left: 0, right: 0,
        textAlign: "center", color: "#fff", fontSize: 12, opacity: .8, zIndex: 2
      }}>
        {title}
      </div>

      <iframe
        title={title}
        src={src}
        width="100%"
        height="100%"
        style={{ border: "0" }}
        // geolocalización para el mapa dentro del iframe
        allow="geolocation *; clipboard-read; clipboard-write; fullscreen"
      />
    </div>
  );
}
