export const addToCartLS = (pkg) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item._id === pkg._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      _id: pkg._id,
      name: pkg.name,
      price: pkg.price,
      image: pkg.packageThumbline,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Dispatch custom event
  window.dispatchEvent(new Event("cartUpdated"));
};


export const removeFromCartLS = (_id) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const newCart = cart.filter((item) => item._id !== _id);
  localStorage.setItem("cart", JSON.stringify(newCart));
  
  // Dispatch event so header updates
  window.dispatchEvent(new Event("cartUpdated"));
};
