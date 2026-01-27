"use client";


import Container from "@/app/shared/ui/Container";
import { useState } from "react";
import AddClients from "./components/AddClients";
import ClientSearch from "./components/ClientSearch";
import Organisations from "./components/Organisations";

export default function Clients() {
  const [activeTab, setActiveTab] = useState("client-search");

  return (
    <section className="py-8">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side Tabs (always visible) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white border border-border-color rounded-md overflow-hidden">
                <TabButton
                  label="Client Search"
                  active={activeTab === "client-search"}
                  onClick={() => setActiveTab("client-search")}
                />
                <TabButton
                  label="Organisations"
                  active={activeTab === "organisations"}
                  onClick={() => setActiveTab("organisations")}
                />
                <TabButton
                  label="Add Client"
                  active={activeTab === "add-client"}
                  onClick={() => setActiveTab("add-client")}
                />
              </div>
            </div>
          </aside>

          {/* Main Content (changes) */}
          <main className="lg:col-span-9">
            {activeTab === "client-search" && <ClientSearch setActiveTab={setActiveTab}/>}
            {activeTab === "add-client" && <AddClients />}
            {activeTab === "organisations" && <Organisations/>}
          </main>

          
        </div>
      </Container>
    </section>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-5 py-4 border-b border-border-color text-sm font-medium text-right
        ${active ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-50"}`}
    >
      {label}
    </button>
  );
}







