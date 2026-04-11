import { clientsCollection, organisationsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

function num(value) {
  return Number(value || 0);
}

function str(value) {
  return String(value || "").trim();
}

export async function GET() {
  try {
    const organizations = await (await organisationsCollection())
      .find({})
      .sort({ createdAt: 1 })
      .toArray();

    const clients = await (await clientsCollection())
      .find({
        roleType: { $ne: "staff" },
      })
      .toArray();

    const rows = organizations.map((org) => {
      const orgId = String(org._id || "");
      const orgName = str(org.name || org.organizationName);

      const assocClients = clients.filter((client) => {
        const clientOrgId = str(
          client.organizationId || client.orgId || client.organisationId
        );
        const clientOrgName = str(
          client.organizationName || client.organisationName
        );

        return (
          (orgId && clientOrgId && clientOrgId === orgId) ||
          (orgName && clientOrgName && clientOrgName === orgName)
        );
      }).length;

      return {
        _id: org._id,
        name: str(org.name || org.organizationName),
        contact: str(
          org.contact ||
            org.contactName ||
            `${str(org.firstName)} ${str(org.lastName)}`.trim()
        ),
        email: str(org.email),
        ccEmail: str(org.ccEmail),
        mobile: str(org.mobile || org.phone || org.mobileNumber),
        landLine: str(org.landLine || org.landline || org.telephone),
        fax: str(org.fax),
        postalAddress: str(
          org.postalAddress || org.address || org.streetAddress
        ),
        postCode: str(org.postCode || org.postcode),
        createdAt: org.createdAt || null,
        acctBalance: num(org.acctBalance || org.accountBalance),
        assocClients,
        memberships: str(org.memberships || org.membership),
        hasVouchers: Boolean(org.hasVouchers || org.voucherCount > 0),
        actionRequired: str(org.actionRequired),
      };
    });

    return NextResponse.json({ rows });
  } catch (error) {
    console.error("All organizations API error:", error);

    return NextResponse.json(
      { error: "Failed to generate all organizations report" },
      { status: 500 }
    );
  }
}