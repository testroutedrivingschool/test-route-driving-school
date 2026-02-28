"use client";

export default function BlogToc({ items, offset = 88 }) {
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <div className="rounded border border-border-color bg-white shadow-sm p-5">
      <h3 className="text-lg font-bold text-secondary">On this page</h3>

      <div className="mt-3 space-y-2 text-sm text-neutral">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToId(item.id)}
            className="block w-full text-left hover:text-primary transition"
          >
            • {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}