// "use client";
// import { useEffect, useState } from "react";

// // Razorpay type definition (simplified)
// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface RazorpayResponse {
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   razorpay_signature: string;
// }

// interface RazorpayOrder {
//   id: string;
//   amount: number;
//   currency: string;
// }

// export default function CheckoutPage() {
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     // Razorpay script load once
//     if (!document.querySelector("#razorpay-script")) {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.id = "razorpay-script";
//       script.async = true;
//       document.body.appendChild(script);
//     }
//   }, []);

//   const handlePayment = async (): Promise<void> => {
//     setLoading(true);
//     try {
//       const amount = 500; // ₹500 (replace with cart total)

//       // 1️⃣ Create order in backend
//       const createRes = await fetch("http://localhost:5000/api/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount }),
//       });

//       const createJson = await createRes.json();
//       if (!createJson.success) throw new Error("Failed to create order");

//       const order: RazorpayOrder = createJson.order;

//       // 2️⃣ Setup Razorpay options
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX",
//         amount: order.amount,
//         currency: order.currency,
//         name: "TMI Restaurant",
//         description: "Order Payment",
//         order_id: order.id,
//         handler: async function (response: RazorpayResponse) {
//           // 3️⃣ Verify payment
//           const verifyRes = await fetch("http://localhost:5000/api/verify-payment", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(response),
//           });

//           const verifyJson = await verifyRes.json();
//           if (verifyJson.success) {
//             alert("✅ Payment successful and verified");
//             // TODO: redirect or update UI
//           } else {
//             alert("❌ Payment verification failed");
//           }
//         },
//         prefill: {
//           name: "Customer Name",
//           email: "customer@example.com",
//           contact: "9999999999",
//         },
//         theme: { color: "#3399cc" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", function (resp: any) {
//         console.error("payment.failed", resp.error);
//         alert("Payment failed: " + resp.error.description);
//       });

//       rzp.open();
//     } catch (err: any) {
//       console.error(err);
//       alert("Payment error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 720, margin: "80px auto", textAlign: "center" }}>
//       <h1>Checkout</h1>
//       <p>
//         Order total: <strong>₹500</strong>
//       </p>
//       <button
//         onClick={handlePayment}
//         disabled={loading}
//         style={{
//           padding: "12px 20px",
//           background: "#0f766e",
//           color: "#fff",
//           border: "none",
//           borderRadius: 8,
//           cursor: "pointer",
//           fontSize: 16,
//         }}
//       >
//         {loading ? "Processing..." : "Pay ₹500"}
//       </button>
//     </div>
//   );
// }
