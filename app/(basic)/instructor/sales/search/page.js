import Container from "@/app/shared/ui/Container";

export default function SalesSearch() {
  return (
    <Container className={`py-5`}>
      <h1 className="text-2xl font-bold mb-6">
        Search for Invoice, Purchase Order or Transaction
      </h1>

      <div className="flex gap-4 max-w-3xl">
        <input
          type="text"
          placeholder="Search..."
          className="input-class"
        />
        <button className="px-6 py-2 bg-primary text-white rounded-md">
          Search
        </button>
      </div>
    </Container>
  );
}
