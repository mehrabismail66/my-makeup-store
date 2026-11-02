import React, { useState } from 'react';
import './App.css';

const productsData = [
  { id: 1, name: "Velvet Matte Lipstick", category: "Lips", price: 1850, image: "https://unsplash.com" },
  { id: 2, name: "Glow Hydrating Foundation", category: "Face", price: 3400, image: "https://unsplash.com" },
  { id: 3, name: "Nude Eyeshadow Palette", category: "Eyes", price: 3800, image: "https://unsplash.com" },
  { id: 4, name: "Velvet Lip Gloss Trio", category: "Lips", price: 2200, image: "https://unsplash.com" },
  { id: 5, name: "Blush & Highlighter Duo", category: "Face", price: 2950, image: "https://unsplash.com" },
  { id: 6, name: "Waterproof Volume Mascara", category: "Eyes", price: 1600, image: "https://unsplash.com" },
  { id: 7, name: "Satin Finish Compact Powder", category: "Face", price: 2400, image: "https://unsplash.com" },
  { id: 8, name: "Long-Wear Gel Eyeliner", category: "Eyes", price: 1450, image: "https://unsplash.com" },
  { id: 9, name: "Hydrating Setting Spray", category: "Face", price: 1950, image: "https://unsplash.com" }
];

function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [currentView, setCurrentView] = useState("shop"); // shop, login, cart
  const [authMode, setAuthMode] = useState("login"); // login, signup
  
  // Auth Form Input States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Checkout Input States
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const changeQuantity = (id, amount) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + amount } : item).filter(item => item.qty > 0));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword || (authMode === "signup" && !authName)) {
      return alert("Please fill all authentications parameters!");
    }
    if (authMode === "signup") {
      setLoggedInUser(authName);
      alert(`🎉 Welcome to LUMÉ! Account created successfully for ${authName}.`);
    } else {
      setLoggedInUser(authEmail.split('@')[0]);
      alert(`🔒 Access Granted! Logged in successfully.`);
    }
    setCurrentView("shop");
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    alert("Logged out from standard secure session matrix.");
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      return alert("Please fill all details to complete your order!");
    }
    alert(`💄 Gorgeous! Thank you ${customerName}. Your GlamVibe order has been registered via Cash on Delivery.`);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setCurrentView("shop");
  };

  const filteredCosmetics = activeTab === "All" 
    ? productsData 
    : productsData.filter(item => item.category === activeTab);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <div>
      <div className="announcement">
        FREE DELIVERY ON ORDERS ABOVE RS. 4,000 ✨
      </div>

      <nav className="navbar">
        <div className="logo" onClick={() => setCurrentView("shop")} style={{cursor: 'pointer'}}>
          <span className="logo-circle">L</span>
          <span>LUMÉ <small>BEAUTY</small></span>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button className="nav-link-btn" onClick={() => setCurrentView("shop")}>Home Store</button>
          {loggedInUser ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="user-badge">👤 Hi, {loggedInUser}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="nav-link-btn" onClick={() => { setCurrentView("login"); setAuthMode("login"); }}>Sign In</button>
          )}
          <div className="shopping-bag-count" onClick={() => setCurrentView("cart")} style={{cursor: 'pointer'}}>
            👜 Bag: {cart.reduce((a, b) => a + b.qty, 0)} items
          </div>
        </div>
      </nav>

      {currentView === "shop" && (
        <>
          <div className="tabs-container">
            {["All", "Face", "Lips", "Eyes"].map(tab => (
              <button 
                key={tab} 
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredCosmetics.map(item => (
              <div key={item.id} className="product-card">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Rs. {item.price}</p>
                <button className="btn" onClick={() => addToCart(item)}>Add to Bag</button>
              </div>
            ))}
          </div>
        </>
      )}

      {currentView === "login" && (
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`} onClick={() => setAuthMode("login")}>Login Session</button>
              <button className={`auth-tab-btn ${authMode === "signup" ? "active" : ""}`} onClick={() => setAuthMode("signup")}>Create Account</button>
            </div>
            
            <form onSubmit={handleAuthSubmit} style={{marginTop: '20px'}}>
              {authMode === "signup" && (
                <input type="text" placeholder="Full Name" className="form-input" value={authName} onChange={(e) => setAuthName(e.target.value)} required />
              )}
              <input type="email" placeholder="Email Address" className="form-input" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
              <input type="password" placeholder="Secure Password" className="form-input" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
              <button type="submit" className="btn" style={{marginTop: '10px'}}>
                {authMode === "login" ? "Authorize Session" : "Initialize Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {currentView === "cart" && (
        <div className="cart-section">
          <h2>🛍️ Checkout Console Bag</h2>
          {cart.length === 0 ? (
            <div>
              <p style={{color: '#8c6d6d', marginBottom: '20px'}}>Your cosmetic bag is empty.</p>
              <button className="btn" style={{width: 'auto'}} onClick={() => setCurrentView("shop")}>Return to Store</button>
            </div>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div>
                    <h4>{item.name} (x{item.qty})</h4>
                    <p style={{color: '#d4af37'}}>Rs. {item.price * item.qty}</p>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button className="btn" style={{width: '30px', padding: '5px'}} onClick={() => changeQuantity(item.id, -1)}>-</button>
                    <button className="btn" style={{width: '30px', padding: '5px'}} onClick={() => changeQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
              <h3 style={{ marginTop: '20px', color: '#d4af37' }}>Total Billing: Rs. {cartTotal}</h3>

              <div style={{ marginTop: '35px', borderTop: '1px dashed #f3d1d1', paddingTop: '25px' }}>
                <h3>📦 Shipping Information (Cash on Delivery)</h3>
                <form onSubmit={handleOrderSubmit}>
                  <input type="text" placeholder="Full Name" className="form-input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                  <input type="text" placeholder="Active Phone Number" className="form-input" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                  <textarea placeholder="Complete Home Delivery Address" className="form-input" rows="3" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required style={{resize: 'none', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #f3d1d1', boxSizing: 'border-box', marginBottom: '15px'}}></textarea>
                  <button type="submit" className="btn">Confirm Booking Order</button>
                </form>
