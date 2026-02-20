"use client";

import Container from "@/app/shared/ui/Container";
import { useEffect, useState } from "react";
import AddClients from "./components/AddClients";
import ClientSearch from "./components/ClientSearch";
import Organisations from "./components/Organisations";
import ClientDetails from "./components/ClientDetails";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBars } from "react-icons/fa";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";

export default function Clients() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("client-search");
  const [selectedClient, setSelectedClient] = useState(null);
  const [loadingClient, setLoadingClient] = useState(false);

  const clientIdFromUrl = searchParams.get("clientId");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ If URL has clientId -> load client and open details tab
  useEffect(() => {
    if (!clientIdFromUrl) return;

    let cancelled = false;

    (async () => {
      try {
        setLoadingClient(true);

        // If already loaded the same client, just open the tab
        if (selectedClient?._id === clientIdFromUrl) {
          setActiveTab("client-details");
          return;
        }

        const res = await axios.get(`/api/clients/${clientIdFromUrl}`);
        if (cancelled) return;

        setSelectedClient(res.data);
        setActiveTab("client-details");
      } catch (err) {
        toast.error(err?.response?.data||"Client not found");
        // optional: clean url
        router.replace("/clients");
      } finally {
        if (!cancelled) setLoadingClient(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    
  }, [clientIdFromUrl,router,selectedClient?._id]);

  const openClientDetails = (client) => {
    setSelectedClient(client);
    setActiveTab("client-details");
    router.push(`/clients?clientId=${client._id}`);
  };

  const backToSearch = () => {
    setActiveTab("client-search");
    router.push("/clients"); 
  };

  return (
    <section className="py-4 md:py-8">
      <Container>
        {/* ✅ Mobile menu (only for small screens) */}
<div className="lg:hidden mb-4">
  <div className="bg-black text-white rounded-md overflow-hidden">
    <button
      type="button"
      onClick={() => setMobileMenuOpen((v) => !v)}
      className="w-full flex items-center gap-3 px-4 py-4"
    >
      <FaBars className="text-xl" />
      <span className="text-lg font-semibold">Client Details</span>
    </button>

    {mobileMenuOpen && (
      <div className="px-4 pb-4 space-y-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("client-search");
            router.push("/clients");
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left py-2"
        >
          Client Search
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("organisations");
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left py-2"
        >
          Organisations
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("add-client");
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left py-2"
        >
          Add Client
        </button>

        {/* ✅ only show these when selectedClient exists */}
        {selectedClient && (
          <>
            <div className="border-t border-white/20 my-2" />

            <button
              type="button"
              onClick={() => {
                setActiveTab("client-details");
                router.push(`/clients?clientId=${selectedClient._id}`);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 font-semibold"
            >
              {selectedClient.firstName} {selectedClient.lastName} 
            </button>

            <button
              type="button"
              onClick={() => {
                router.push(`/instructor/sales/sales?clientId=${selectedClient._id}`);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              New Sale / Purchase
            </button>

            <button
              type="button"
              onClick={() => {
                router.push(`/instructor-bookings`);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Book Now
            </button>
          </>
        )}
      </div>
    )}
  </div>
</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
          {/* Left Side Tabs */}
          <aside className="hidden lg:block lg:col-span-3">
            
            <div className="sticky md:top-[89px] ">
              <div className="bg-white border border-border-color rounded-md overflow-hidden">
                <TabButton
                  label="Client Search"
                  active={activeTab === "client-search"}
                  onClick={() => {
                    setActiveTab("client-search");
                    router.push("/clients");
                  }}
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

                {/* ✅ only show when selected */}
                {selectedClient && (
                  <>
                    <TabButton
                      label={`${selectedClient.firstName} ${selectedClient.lastName}`}
                      active={activeTab === "client-details"}
                      onClick={() => {
                        setActiveTab("client-details");
                        router.push(`/clients?clientId=${selectedClient._id}`);
                      }}
                    />

                    <TabButton
                      label="New Sale/Purchase"
                      onClick={() =>
                        router.push(
                          `/instructor/sales/sales?clientId=${selectedClient._id}`
                        )
                      }
                    />

                    <TabButton
                      label="Book Now"
                      onClick={() =>
                        router.push(
                          `/instructor-bookings`
                        )
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 ">
            {activeTab === "client-search" && (
              <ClientSearch
                setActiveTab={setActiveTab}
                setSelectedClient={openClientDetails} // ✅ open + update url
              />
            )}

            {activeTab === "add-client" && <AddClients />}

            {activeTab === "organisations" && <Organisations />}

            {activeTab === "client-details" && selectedClient && (
              <ClientDetails client={selectedClient} onBack={backToSearch} />
            )}

            {loadingClient && !selectedClient ? <LoadingSpinner/>: null}
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
