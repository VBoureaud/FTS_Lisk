import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer
      style={{
        borderTop: "1px white solid",
        padding: "3rem",
        display: "flex",
        gap: "6rem",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        <strong>Contact</strong>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a href="mailto:team@poc.fr" target={"_blank"}>
            Mail
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
