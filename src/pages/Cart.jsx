import { useCart } from "../context/CartContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subscriptionType,
    setSubscriptionType,
    checkout,
    loading,
  } = useCart();

  const [checkoutMsg, setCheckoutMsg] = useState("");

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(cartItems);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    // CartContext me setCartItems backend sync ke liye use hota hai
    // setCartItems(items); // Agar chaho to yahan bhi useCart se setCartItems le sakte ho
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleCheckout = async () => {
    setCheckoutMsg("");
    try {
      await checkout();
      setCheckoutMsg("Subscription confirmed! Your box has been saved.");
    } catch {
      setCheckoutMsg("Something went wrong. Please try again.");
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="p-8 text-center text-gray-600">
        Your box is empty.
        {checkoutMsg && (
          <div className="text-green-700 font-semibold mt-2">{checkoutMsg}</div>
        )}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Box</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="box-list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {cartItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center gap-4 p-4 border rounded shadow-sm bg-white ${
                        snapshot.isDragging ? "bg-indigo-50" : ""
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                      />
                      <div className="flex-1">
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-indigo-700 font-bold">
                          ₹{item.price}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            className="px-2 py-1 border rounded"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                (item.quantity || 1) - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity || 1}</span>
                          <button
                            className="px-2 py-1 border rounded"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                (item.quantity || 1) + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className="text-red-600 font-semibold hover:underline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                      <span
                        className="cursor-grab text-gray-400 ml-2"
                        title="Drag to reorder"
                      >
                        &#9776;
                      </span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <span className="font-semibold">Subscription Type:</span>{" "}
          <select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
            className="capitalize border px-2 py-1 rounded"
          >
            <option value="one-time">One Time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="font-bold text-xl">Total: ₹{totalPrice}</div>
      </div>
      <div className="mt-6 text-right">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-semibold"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Subscription"}
        </button>
        {checkoutMsg && (
          <div className="text-green-700 font-semibold mt-2">{checkoutMsg}</div>
        )}
      </div>
    </div>
  );
}
