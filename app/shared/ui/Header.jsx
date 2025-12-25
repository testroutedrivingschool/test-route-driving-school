import React from "react";
import Navbar from "./Navbar";
import TopHeader from "./TopHeader";

export default function Header() {
  return (
    <header className="sticky top-0 z-99">
   
      <Navbar className={`sticky top-0`}/>
    </header>
  );
}
