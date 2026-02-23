import React from "react";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="sticky top-0 z-9999">
   
      <Navbar className={`sticky top-0`}/>
    </header>
  );
}
