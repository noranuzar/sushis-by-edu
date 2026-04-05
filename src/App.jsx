import { useState, useEffect } from "react";

const PHONE = "51933659035";
const ADMIN_PIN = "2835";

const DEFAULT_MAKIS = [
  {
    id: "lomo",
    name: "Maki Lomo Saltado",
    emoji: "🔥",
    badge: "El más pedido",
    badgeColor: "#C41E3A",
    desc: "La fusión perfecta del clásico limeño envuelto en nori crujiente",
    basePrice: 0,
    base: [
      { id: "lomo-fino", name: "Lomo fino", icon: "🥩", isBase: true, allergens: [] },
      { id: "sillao", name: "Sillao", icon: "🫗", isBase: true, allergens: ["soja"] },
      { id: "aji-amarillo-l", name: "Ají amarillo", icon: "🌶️", isBase: true, allergens: [] },
      { id: "arroz-sushi-l", name: "Arroz de sushi", icon: "🍚", isBase: true, allergens: ["gluten"] },
      { id: "nori-l", name: "Nori crujiente", icon: "🍃", isBase: true, allergens: [] },
      { id: "limon-l", name: "Limón", icon: "🍋", isBase: true, allergens: [] },
    ],
    extras: [
      { id: "palta-l", name: "Palta", icon: "🥑", price: 0, allergens: [] },
      { id: "cebolla-china-l", name: "Cebolla china", icon: "🧅", price: 0, allergens: [] },
      { id: "tomate-l", name: "Tomate", icon: "🍅", price: 0, allergens: [] },
      { id: "queso-crema-l", name: "Queso crema", icon: "🧀", price: 0, allergens: ["lacteos"] },
      { id: "ajonjoli-l", name: "Ajonjolí", icon: "⚪", price: 0, allergens: ["sesamo"] },
    ],
  },
  {
    id: "gallina",
    name: "Maki Ají de Gallina",
    emoji: "✨",
    badge: "Favorito de la casa",
    badgeColor: "#A67C2E",
    desc: "Cremoso, con el sabor de casa que no encontrarás en otro lado",
    basePrice: 0,
    base: [
      { id: "pollo", name: "Pollo deshilachado", icon: "🍗", isBase: true, allergens: [] },
      { id: "crema-aji", name: "Crema de ají amarillo", icon: "🌶️", isBase: true, allergens: ["lacteos"] },
      { id: "pecanas", name: "Pecanas", icon: "🥜", isBase: true, allergens: ["frutos_secos"] },
      { id: "aceituna", name: "Aceituna negra", icon: "🫒", isBase: true, allergens: [] },
      { id: "arroz-sushi-g", name: "Arroz de sushi", icon: "🍚", isBase: true, allergens: ["gluten"] },
      { id: "nori-g", name: "Nori", icon: "🍃", isBase: true, allergens: [] },
    ],
    extras: [
      { id: "huevo-g", name: "Huevo duro", icon: "🥚", price: 0, allergens: ["huevo"] },
      { id: "palta-g", name: "Palta", icon: "🥑", price: 0, allergens: [] },
      { id: "queso-crema-g", name: "Queso crema", icon: "🧀", price: 0, allergens: ["lacteos"] },
      { id: "papa-g", name: "Papa crocante", icon: "🥔", price: 0, allergens: ["gluten"] },
      { id: "rocoto-g", name: "Toque de rocoto", icon: "🔴", price: 0, allergens: [] },
    ],
  },
  {
    id: "cevichero",
    name: "Maki Cevichero",
    emoji: "❄️",
    badge: "Ideal verano",
    badgeColor: "#2E7D9A",
    desc: "Fresco, ácido, perfecto para este calor",
    basePrice: 0,
    base: [
      { id: "pescado", name: "Pescado fresco", icon: "🐟", isBase: true, allergens: ["pescado"] },
      { id: "leche-tigre", name: "Leche de tigre", icon: "🥛", isBase: true, allergens: ["pescado"] },
      { id: "canchita", name: "Canchita crocante", icon: "🌽", isBase: true, allergens: [] },
      { id: "cebolla-roja", name: "Cebolla roja", icon: "🧅", isBase: true, allergens: [] },
      { id: "arroz-sushi-c", name: "Arroz de sushi", icon: "🍚", isBase: true, allergens: ["gluten"] },
      { id: "nori-c", name: "Nori", icon: "🍃", isBase: true, allergens: [] },
    ],
    extras: [
      { id: "camote-c", name: "Camote frito", icon: "🍠", price: 0, allergens: ["gluten"] },
      { id: "choclo-c", name: "Choclo desgranado", icon: "🌽", price: 0, allergens: [] },
      { id: "palta-c", name: "Palta", icon: "🥑", price: 0, allergens: [] },
      { id: "cilantro-c", name: "Culantro", icon: "🌿", price: 0, allergens: [] },
      { id: "rocoto-c", name: "Rocoto", icon: "🔴", price: 0, allergens: [] },
    ],
  },
];

const ALLERGEN_INFO = {
  gluten: { icon: "🌾", label: "Gluten" },
  lacteos: { icon: "🥛", label: "Lácteos" },
  frutos_secos: { icon: "🥜", label: "Frutos secos" },
  huevo: { icon: "🥚", label: "Huevo" },
  pescado: { icon: "🐟", label: "Pescado" },
  soja: { icon: "🫘", label: "Soja" },
  sesamo: { icon: "⚪", label: "Sésamo" },
};

const STORAGE_KEY = "sushis-edu-menu";

/* ============================================================
   ADMIN PANEL
   ============================================================ */
function AdminPanel({ menuData, onSave, onLogout }) {
  const [local, setLocal] = useState(JSON.parse(JSON.stringify(menuData)));
  const [saved, setSaved] = useState(false);

  const updateBasePrice = (makiIdx, val) => {
    const copy = JSON.parse(JSON.stringify(local));
    copy[makiIdx].basePrice = parseFloat(val) || 0;
    setLocal(copy);
  };

  const updateExtraPrice = (makiIdx, extraIdx, val) => {
    const copy = JSON.parse(JSON.stringify(local));
    copy[makiIdx].extras[extraIdx].price = parseFloat(val) || 0;
    setLocal(copy);
  };

  const handleSave = async () => {
    onSave(local);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    } catch (e) {
      console.error("Storage save failed", e);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", color: "#F5F0E8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #1A1A1A; }
        input[type=number] {
          -moz-appearance: textfield;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

      {/* Admin Header */}
      <div style={{
        background: "linear-gradient(135deg, #2C2A25, #3B3D2A)",
        padding: "24px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid rgba(166,124,46,0.3)",
      }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "28px", letterSpacing: "4px" }}>
            🔐 PANEL DE EDU
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#8A8270" }}>
            Configura precios de tu carta
          </div>
        </div>
        <button onClick={onLogout} style={{
          padding: "8px 18px",
          borderRadius: "8px",
          border: "1px solid rgba(245,240,232,0.15)",
          background: "transparent",
          color: "#AEA899",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          cursor: "pointer",
        }}>
          Salir
        </button>
      </div>

      {/* Maki price editors */}
      <div style={{ padding: "20px 16px 120px", maxWidth: "600px", margin: "0 auto" }}>
        {local.map((maki, mIdx) => (
          <div key={maki.id} style={{
            background: "#2C2A25",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "16px",
            border: "1px solid rgba(166,124,46,0.12)",
          }}>
            {/* Maki name + base price */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>{maki.emoji}</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "17px" }}>
                    {maki.name}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#8A8270" }}>
                    Precio base del roll
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "16px", color: "#A67C2E", fontWeight: 600 }}>S/</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={maki.basePrice || ""}
                  onChange={(e) => updateBasePrice(mIdx, e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: "80px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "2px solid rgba(166,124,46,0.3)",
                    background: "#1A1A1A",
                    color: "#F5F0E8",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                />
              </div>
            </div>

            {/* Extras */}
            <div style={{
              borderTop: "1px solid rgba(245,240,232,0.06)",
              paddingTop: "12px",
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "12px",
                letterSpacing: "3px",
                color: "#BE1E2D",
                marginBottom: "10px",
              }}>
                PRECIO DE EXTRAS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {maki.extras.map((extra, eIdx) => (
                  <div key={extra.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      color: "#AEA899",
                    }}>
                      <span style={{ fontSize: "16px" }}>{extra.icon}</span>
                      {extra.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#8A8270" }}>+S/</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={extra.price || ""}
                        onChange={(e) => updateExtraPrice(mIdx, eIdx, e.target.value)}
                        placeholder="0"
                        style={{
                          width: "65px",
                          padding: "7px 10px",
                          borderRadius: "8px",
                          border: "1px solid rgba(245,240,232,0.1)",
                          background: "#1A1A1A",
                          color: "#F5F0E8",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "15px",
                          textAlign: "right",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        padding: "16px 20px",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        background: "linear-gradient(180deg, transparent 0%, #1A1A1A 30%)",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <button onClick={handleSave} style={{
            width: "100%",
            padding: "18px",
            borderRadius: "14px",
            border: "none",
            background: saved
              ? "#3B3D2A"
              : "linear-gradient(135deg, #A67C2E, #C49A3C)",
            color: "#F5F0E8",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "22px",
            letterSpacing: "3px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}>
            {saved ? "✓ PRECIOS GUARDADOS" : "GUARDAR PRECIOS"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INGREDIENT CHIP (Customer)
   ============================================================ */
function IngredientChip({ item, onToggle, price }) {
  const [pop, setPop] = useState(false);
  const handleClick = () => {
    setPop(true);
    onToggle();
    setTimeout(() => setPop(false), 300);
  };
  const showPrice = !item.isBase && price > 0;
  const hasAllergens = item.allergens && item.allergens.length > 0;

  return (
    <button onClick={handleClick} style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "7px 14px",
      borderRadius: "24px",
      border: item.included
        ? "2px solid rgba(166,124,46,0.35)"
        : "2px dashed rgba(0,0,0,0.1)",
      background: item.included
        ? "linear-gradient(135deg, #F5F0E4, #EDE7D6)"
        : "rgba(0,0,0,0.02)",
      color: item.included ? "#3B3D2A" : "#AEA899",
      fontSize: "13px",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: item.included ? 600 : 400,
      cursor: "pointer",
      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: pop ? "scale(1.12)" : "scale(1)",
      opacity: item.included ? 1 : 0.55,
      textDecoration: item.included && item.isBase ? "none" : !item.included && item.isBase ? "line-through" : "none",
    }}>
      <span style={{ fontSize: "15px" }}>{item.icon}</span>
      <span>{item.name}</span>
      {hasAllergens && (
        <span style={{ fontSize: "10px", opacity: 0.6, marginLeft: "-2px" }} title={item.allergens.map(a => ALLERGEN_INFO[a]?.label).join(", ")}>
          {item.allergens.map(a => ALLERGEN_INFO[a]?.icon).join("")}
        </span>
      )}
      {showPrice && item.included && (
        <span style={{ fontSize: "11px", color: "#A67C2E", fontWeight: 700 }}>+S/{price}</span>
      )}
      {showPrice && !item.included && (
        <span style={{ fontSize: "11px", color: "#A67C2E" }}>+S/{price}</span>
      )}
      {item.isBase && (
        item.included
          ? <span style={{ fontSize: "11px", opacity: 0.4 }}>✕</span>
          : <span style={{ fontSize: "11px", color: "#A67C2E" }}>+</span>
      )}
    </button>
  );
}

/* ============================================================
   MAKI CARD (Customer)
   ============================================================ */
function MakiCard({ maki, ingredients, onToggle, onAddToOrder, onChangeQty, inOrder, qty, index }) {
  const [expanded, setExpanded] = useState(false);

  const extrasTotal = ingredients
    .filter((i) => !i.isBase && i.included)
    .reduce((sum, i) => sum + (i.price || 0), 0);
  const unitPrice = (maki.basePrice || 0) + extrasTotal;
  const hasPrices = maki.basePrice > 0;

  return (
    <div style={{
      background: "#F8F3EA",
      borderRadius: "20px",
      overflow: "hidden",
      border: inOrder ? "2px solid rgba(166,124,46,0.4)" : "1px solid rgba(0,0,0,0.04)",
      transition: "all 0.3s ease",
      animation: `fadeSlideIn 0.5s ease ${index * 0.12}s both`,
    }}>
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)} style={{
        padding: "18px 20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}>
        <div style={{
          width: "48px", height: "48px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #EDE7D6, #E2DBCA)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", flexShrink: 0,
        }}>
          {maki.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Lora', serif", fontSize: "18px",
            fontWeight: 600, color: "#2C2A25", marginBottom: "2px",
          }}>
            {maki.name}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
            color: "#8A8270", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {maki.desc}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
          {hasPrices && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: "20px", color: "#3B3D2A",
            }}>
              S/{unitPrice.toFixed(1)}
            </div>
          )}
          <span style={{
            fontSize: "9px", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px",
            color: maki.badgeColor, background: `${maki.badgeColor}11`,
            padding: "3px 10px", borderRadius: "20px",
          }}>
            {maki.badge}
          </span>
        </div>
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: expanded ? "#3B3D2A" : "rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
          color: expanded ? "#F8F3EA" : "#8A8270", fontSize: "13px",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          flexShrink: 0,
        }}>
          ▾
        </div>
      </div>

      {/* Expandable */}
      <div style={{
        maxHeight: expanded ? "600px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ padding: "0 20px 18px" }}>
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(166,124,46,0.15), transparent)",
            marginBottom: "14px",
          }} />

          {/* Base ingredients */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: "12px",
              letterSpacing: "3px", color: "#A67C2E", marginBottom: "8px",
            }}>
              INGREDIENTES BASE
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {ingredients.filter((i) => i.isBase).map((item) => (
                <IngredientChip key={item.id} item={item} price={0}
                  onToggle={() => onToggle(item.id)} />
              ))}
            </div>
          </div>

          {/* Extras */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: "12px",
              letterSpacing: "3px", color: "#BE1E2D", marginBottom: "8px",
            }}>
              AGRÉGALE MÁS
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {ingredients.filter((i) => !i.isBase).map((item) => (
                <IngredientChip key={item.id} item={item} price={item.price || 0}
                  onToggle={() => onToggle(item.id)} />
              ))}
            </div>
          </div>

          {/* Add + quantity */}
          <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
            <button onClick={onAddToOrder} style={{
              flex: 1, padding: "13px",
              borderRadius: "14px", border: "none",
              background: inOrder ? "#3B3D2A" : "linear-gradient(135deg, #BE1E2D, #9B1830)",
              color: "#F8F3EA",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px",
              letterSpacing: "2px", cursor: "pointer",
              transition: "all 0.3s ease",
            }}>
              {inOrder ? "✓ EN TU PEDIDO" : "AGREGAR A MI PEDIDO"}
            </button>
            {inOrder && (
              <div style={{
                display: "flex", alignItems: "center", gap: "0",
                background: "#EDE7D6", borderRadius: "14px", overflow: "hidden",
              }}>
                <button onClick={() => onChangeQty(-1)} style={{
                  width: "40px", height: "100%", border: "none",
                  background: "transparent", fontSize: "20px",
                  cursor: "pointer", color: "#3B3D2A", fontWeight: 700,
                }}>−</button>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: "18px", color: "#3B3D2A", minWidth: "28px",
                  textAlign: "center",
                }}>{qty}</span>
                <button onClick={() => onChangeQty(1)} style={{
                  width: "40px", height: "100%", border: "none",
                  background: "transparent", fontSize: "20px",
                  cursor: "pointer", color: "#3B3D2A", fontWeight: 700,
                }}>+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [view, setView] = useState("loading"); // loading | login | admin | customer
  const [menuData, setMenuData] = useState(DEFAULT_MAKIS);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [allIngredients, setAllIngredients] = useState({});
  const [order, setOrder] = useState({});
  const [quantities, setQuantities] = useState({});
  const [sent, setSent] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Load menu data from storage
  useEffect(() => {
    (async () => {
      try {
        const result = { value: localStorage.getItem(STORAGE_KEY) };
        if (result && result.value) {
          const parsed = JSON.parse(result.value);
          setMenuData(parsed);
          initIngredients(parsed);
        } else {
          initIngredients(DEFAULT_MAKIS);
        }
      } catch (e) {
        initIngredients(DEFAULT_MAKIS);
      }
      setView("customer");
    })();
  }, []);

  const initIngredients = (data) => {
    const map = {};
    data.forEach((m) => {
      map[m.id] = [
        ...m.base.map((b) => ({ ...b, included: true })),
        ...m.extras.map((e) => ({ ...e, included: false })),
      ];
    });
    setAllIngredients(map);
  };

  const handleAdminSave = (newData) => {
    setMenuData(newData);
    // Update extra prices in customer ingredients
    setAllIngredients((prev) => {
      const copy = { ...prev };
      newData.forEach((m) => {
        if (copy[m.id]) {
          copy[m.id] = copy[m.id].map((ing) => {
            const extraMatch = m.extras.find((e) => e.id === ing.id);
            if (extraMatch) return { ...ing, price: extraMatch.price };
            return ing;
          });
        }
      });
      return copy;
    });
  };

  const tryLogin = () => {
    if (pin === ADMIN_PIN) {
      setView("admin");
      setPinError(false);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1500);
    }
  };

  const toggleIngredient = (makiId, ingId) => {
    setAllIngredients((prev) => ({
      ...prev,
      [makiId]: prev[makiId].map((i) =>
        i.id === ingId ? { ...i, included: !i.included } : i
      ),
    }));
  };

  const toggleOrder = (makiId) => {
    setOrder((prev) => {
      const copy = { ...prev };
      if (copy[makiId]) {
        delete copy[makiId];
        setQuantities((q) => { const qc = { ...q }; delete qc[makiId]; return qc; });
      } else {
        copy[makiId] = true;
        setQuantities((q) => ({ ...q, [makiId]: 1 }));
      }
      return copy;
    });
  };

  const changeQty = (makiId, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[makiId] || 1) + delta);
      return { ...prev, [makiId]: newQty };
    });
  };

  const calcTotal = () => {
    let total = 0;
    Object.keys(order).forEach((makiId) => {
      const maki = menuData.find((m) => m.id === makiId);
      const ings = allIngredients[makiId] || [];
      const extrasTotal = ings.filter((i) => !i.isBase && i.included).reduce((s, i) => s + (i.price || 0), 0);
      total += ((maki.basePrice || 0) + extrasTotal) * (quantities[makiId] || 1);
    });
    return total;
  };

  const orderCount = Object.keys(order).reduce((s, k) => s + (quantities[k] || 1), 0);
  const total = calcTotal();
  const hasPrices = menuData.some((m) => m.basePrice > 0);

  const getOrderAllergens = () => {
    const allergenSet = new Set();
    Object.keys(order).forEach((makiId) => {
      const ings = allIngredients[makiId] || [];
      ings.filter((i) => i.included && i.allergens).forEach((i) => {
        i.allergens.forEach((a) => allergenSet.add(a));
      });
    });
    return Array.from(allergenSet);
  };
  const orderAllergens = getOrderAllergens();

  const buildMsg = () => {
    let msg = "🍣 *Pedido Sushi's by EDU*\n\n";
    Object.keys(order).forEach((makiId) => {
      const maki = menuData.find((m) => m.id === makiId);
      const ings = allIngredients[makiId].filter((i) => i.included);
      const removed = allIngredients[makiId].filter((i) => i.isBase && !i.included);
      const added = allIngredients[makiId].filter((i) => !i.isBase && i.included);
      const qty = quantities[makiId] || 1;
      const extrasTotal = added.reduce((s, i) => s + (i.price || 0), 0);
      const unitP = (maki.basePrice || 0) + extrasTotal;

      msg += `${maki.emoji} *${maki.name}* x${qty}`;
      if (hasPrices) msg += ` — S/${(unitP * qty).toFixed(1)}`;
      msg += "\n";
      if (removed.length > 0) msg += `   ❌ Sin: ${removed.map((i) => i.name).join(", ")}\n`;
      if (added.length > 0) msg += `   ➕ Extra: ${added.map((i) => i.name).join(", ")}\n`;
      msg += "\n";
    });
    if (hasPrices) msg += `💰 *Total: S/${total.toFixed(1)}*\n\n`;
    msg += "¡Gracias! 🙏";
    return encodeURIComponent(msg);
  };

  const sendOrder = () => {
    window.open(`https://wa.me/${PHONE}?text=${buildMsg()}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  if (view === "loading") {
    return (
      <div style={{
        minHeight: "100vh", background: "#F0EBE0",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <style>{`body { background: #F0EBE0; }`}</style>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px",
          color: "#A67C2E", letterSpacing: "4px",
          animation: "pulse 1.5s infinite",
        }}>
          CARGANDO...
        </div>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div style={{
        minHeight: "100vh", background: "#1A1A1A",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "20px", padding: "20px",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #1A1A1A; }
        `}</style>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: "#F5F0E8", letterSpacing: "5px" }}>
          🔐 ACCESO EDU
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryLogin()}
            placeholder="PIN"
            style={{
              width: "140px", padding: "14px 18px",
              borderRadius: "12px",
              border: pinError ? "2px solid #BE1E2D" : "2px solid rgba(166,124,46,0.3)",
              background: "#2C2A25", color: "#F5F0E8",
              fontFamily: "'DM Sans', sans-serif", fontSize: "22px",
              textAlign: "center", letterSpacing: "6px",
              transition: "border 0.3s ease",
            }}
          />
          <button onClick={tryLogin} style={{
            padding: "14px 24px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #A67C2E, #C49A3C)",
            color: "#F5F0E8",
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px",
            letterSpacing: "2px", cursor: "pointer",
          }}>
            ENTRAR
          </button>
        </div>
        {pinError && (
          <div style={{ color: "#BE1E2D", fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
            PIN incorrecto
          </div>
        )}
        <button onClick={() => setView("customer")} style={{
          marginTop: "10px", background: "none", border: "none",
          color: "#8A8270", fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px", cursor: "pointer", textDecoration: "underline",
        }}>
          Volver a la carta
        </button>
      </div>
    );
  }

  if (view === "admin") {
    return (
      <AdminPanel
        menuData={menuData}
        onSave={handleAdminSave}
        onLogout={() => { setView("customer"); initIngredients(menuData); }}
      />
    );
  }

  /* ============================================================
     CUSTOMER VIEW
     ============================================================ */
  return (
    <div style={{ minHeight: "100vh", background: "#F0EBE0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.25); }
          50% { box-shadow: 0 4px 35px rgba(37,211,102,0.5); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #F0EBE0; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #2C2A25, #3B3D2A)",
        padding: "28px 20px 24px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-30%", right: "-10%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(196,30,58,0.08) 0%, transparent 60%)",
        }} />
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(34px, 8vw, 50px)",
          letterSpacing: "8px", color: "#F5F0E8", lineHeight: 1,
          position: "relative",
        }}>
          SUSHI'S <span style={{ color: "#BE1E2D" }}>BY EDU</span>
        </div>
        <div style={{
          display: "inline-block", marginTop: "8px",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(10px, 2.5vw, 13px)",
          letterSpacing: "4px", color: "#F5F0E8",
          background: "linear-gradient(135deg, #A67C2E, #C49A3C)",
          padding: "4px 18px", borderRadius: "20px",
          position: "relative",
        }}>
          FUSIÓN NIKKEI CRIOLLA · LIMA
        </div>
        <div style={{
          marginTop: "12px",
          fontFamily: "'Lora', serif", fontStyle: "italic",
          fontSize: "clamp(15px, 3.8vw, 20px)",
          color: "rgba(245,240,232,0.8)", position: "relative",
        }}>
          <span style={{ color: "#C49A3C", fontWeight: 600, fontStyle: "normal" }}>Manos peruanas,</span>{" "}
          alma criolla en tu sushi
        </div>
      </div>

      {/* Intro */}
      <div style={{ padding: "18px 20px 6px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px",
          letterSpacing: "5px", color: "#BE1E2D", marginBottom: "4px",
        }}>
          ARMA TU MAKI
        </div>
        <div style={{ fontSize: "13px", color: "#8A8270", maxWidth: "380px", margin: "0 auto" }}>
          Personaliza los ingredientes y envía tu pedido por WhatsApp
        </div>
      </div>

      {/* Maki Cards */}
      <div style={{ padding: "14px 14px 140px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {menuData.map((maki, idx) => (
            <MakiCard
              key={maki.id}
              maki={maki}
              ingredients={allIngredients[maki.id] || []}
              onToggle={(ingId) => toggleIngredient(maki.id, ingId)}
              onAddToOrder={() => toggleOrder(maki.id)}
              onChangeQty={(d) => changeQty(maki.id, d)}
              inOrder={!!order[maki.id]}
              qty={quantities[maki.id] || 1}
              index={idx}
            />
          ))}
        </div>

        {/* Admin access link */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button onClick={() => setView("login")} style={{
            background: "none", border: "none",
            color: "#C5BFAC", fontSize: "11px",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            opacity: 0.5,
          }}>
            ⚙
          </button>
        </div>
      </div>

      {/* ============ ORDER SUMMARY PANEL ============ */}
      {showSummary && orderCount > 0 && (
        <>
          {/* Backdrop */}
          <div onClick={() => setShowSummary(false)} style={{
            position: "fixed", inset: 0, background: "rgba(26,26,26,0.5)",
            zIndex: 90, animation: "fadeIn 0.25s ease",
          }} />

          {/* Summary drawer */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            maxHeight: "85vh", zIndex: 100,
            background: "#F8F3EA",
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
            display: "flex", flexDirection: "column",
            animation: "slideUp 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}>
            {/* Drag handle + header */}
            <div style={{ padding: "12px 20px 0", textAlign: "center", flexShrink: 0 }}>
              <div style={{
                width: "40px", height: "4px", borderRadius: "2px",
                background: "rgba(0,0,0,0.12)", margin: "0 auto 14px",
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px",
                  letterSpacing: "4px", color: "#2C2A25",
                }}>
                  🧾 TU PEDIDO
                </div>
                <button onClick={() => setShowSummary(false)} style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  border: "none", background: "rgba(0,0,0,0.05)",
                  fontSize: "16px", cursor: "pointer", color: "#8A8270",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 14px" }}>
              {Object.keys(order).map((makiId) => {
                const maki = menuData.find((m) => m.id === makiId);
                const ings = allIngredients[makiId] || [];
                const removed = ings.filter((i) => i.isBase && !i.included);
                const added = ings.filter((i) => !i.isBase && i.included);
                const extrasTotal = added.reduce((s, i) => s + (i.price || 0), 0);
                const unitPrice = (maki.basePrice || 0) + extrasTotal;
                const qty = quantities[makiId] || 1;

                return (
                  <div key={makiId} style={{
                    background: "#F0EBE0", borderRadius: "16px",
                    padding: "16px", marginBottom: "10px",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    {/* Maki name + price + remove */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                        <span style={{ fontSize: "22px" }}>{maki.emoji}</span>
                        <div>
                          <div style={{
                            fontFamily: "'Lora', serif", fontWeight: 600,
                            fontSize: "16px", color: "#2C2A25",
                          }}>
                            {maki.name}
                          </div>
                          {hasPrices && (
                            <div style={{
                              fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                              color: "#A67C2E", fontWeight: 600,
                            }}>
                              S/{unitPrice.toFixed(1)} c/u
                            </div>
                          )}
                        </div>
                      </div>
                      <button onClick={() => toggleOrder(makiId)} style={{
                        background: "rgba(190,30,45,0.08)", border: "none",
                        borderRadius: "8px", padding: "6px 10px",
                        cursor: "pointer", fontSize: "11px",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                        color: "#BE1E2D",
                      }}>
                        Quitar
                      </button>
                    </div>

                    {/* Customizations */}
                    {(removed.length > 0 || added.length > 0) && (
                      <div style={{ marginBottom: "10px", paddingLeft: "32px" }}>
                        {removed.length > 0 && (
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                            color: "#BE1E2D", marginBottom: "3px",
                          }}>
                            ❌ Sin: {removed.map((i) => i.name).join(", ")}
                          </div>
                        )}
                        {added.length > 0 && (
                          <div style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                            color: "#3B7A3A",
                          }}>
                            ➕ Extra: {added.map((i) => {
                              const p = i.price > 0 ? ` (+S/${i.price})` : "";
                              return i.name + p;
                            }).join(", ")}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quantity + subtotal */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: "8px",
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center",
                        background: "#E8E3D6", borderRadius: "10px", overflow: "hidden",
                      }}>
                        <button onClick={() => changeQty(makiId, -1)} style={{
                          width: "36px", height: "36px", border: "none",
                          background: "transparent", fontSize: "18px",
                          cursor: "pointer", color: "#3B3D2A", fontWeight: 700,
                        }}>−</button>
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                          fontSize: "16px", color: "#3B3D2A", minWidth: "24px",
                          textAlign: "center",
                        }}>{qty}</span>
                        <button onClick={() => changeQty(makiId, 1)} style={{
                          width: "36px", height: "36px", border: "none",
                          background: "transparent", fontSize: "18px",
                          cursor: "pointer", color: "#3B3D2A", fontWeight: 700,
                        }}>+</button>
                      </div>
                      {hasPrices && (
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                          fontSize: "18px", color: "#2C2A25",
                        }}>
                          S/{(unitPrice * qty).toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total + Send */}
            <div style={{
              padding: "14px 20px",
              paddingBottom: "max(14px, env(safe-area-inset-bottom))",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              flexShrink: 0,
            }}>
              {/* Allergen warning — dynamic based on selected ingredients */}
              {orderAllergens.length > 0 && (
                <div style={{
                  background: "rgba(212,160,23,0.06)",
                  border: "1px solid rgba(212,160,23,0.12)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  marginBottom: "14px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
                  <div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px", fontWeight: 600,
                      color: "#8A7340", textTransform: "uppercase",
                      letterSpacing: "1px", marginBottom: "4px",
                    }}>
                      Tu pedido contiene
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {orderAllergens.map((a) => (
                        <span key={a} style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          background: "rgba(255,255,255,0.6)",
                          padding: "3px 10px", borderRadius: "12px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "11px", fontWeight: 500,
                          color: "#5E4A39",
                        }}>
                          {ALLERGEN_INFO[a]?.icon} {ALLERGEN_INFO[a]?.label}
                        </span>
                      ))}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px", color: "#AEA080",
                      marginTop: "5px", fontStyle: "italic",
                    }}>
                      Si tienes alguna alergia, comunícalo al hacer tu pedido
                    </div>
                  </div>
                </div>
              )}
              {hasPrices && (
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "12px",
                }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#8A8270",
                  }}>Total del pedido</span>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: "30px",
                    color: "#2C2A25", letterSpacing: "1px",
                  }}>S/{total.toFixed(1)}</span>
                </div>
              )}
              <button onClick={() => { sendOrder(); setShowSummary(false); }} style={{
                width: "100%", padding: "16px 20px",
                borderRadius: "16px", border: "none",
                background: sent ? "#3B3D2A" : "linear-gradient(135deg, #25D366, #128C7E)",
                color: "white",
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px",
                letterSpacing: "2px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                transition: "all 0.3s ease",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                CONFIRMAR Y ENVIAR POR WHATSAPP
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============ FLOATING ORDER BAR ============ */}
      {orderCount > 0 && !showSummary && (
        <div style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          padding: "14px 16px",
          paddingBottom: "max(14px, env(safe-area-inset-bottom))",
          background: "linear-gradient(180deg, transparent 0%, rgba(240,235,224,0.97) 25%, #F0EBE0 50%)",
          animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          zIndex: 50,
        }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <button onClick={() => setShowSummary(true)} style={{
              width: "100%", padding: "16px 20px",
              borderRadius: "16px", border: "none",
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              color: "white",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px",
              letterSpacing: "2px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              animation: "pulseGlow 2s infinite",
              transition: "all 0.3s ease",
            }}>
              <span>🧾</span>
              VER PEDIDO ({orderCount} {orderCount === 1 ? "maki" : "makis"})
              {hasPrices && <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "16px", letterSpacing: 0 }}>· S/{total.toFixed(1)}</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
