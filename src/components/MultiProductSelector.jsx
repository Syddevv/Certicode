import React, { useEffect, useMemo, useState } from "react";
import "../styles/ProductSelectorModal.css";
import {
  IconWorldWww,
  IconDeviceMobile,
  IconPalette,
  IconFolderStar,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";

const FILTERS = [
  { label: "All Assets" },
  { label: "Web Apps", icon: <IconWorldWww size={13} stroke={1.8} /> },
  { label: "Mobile Apps", icon: <IconDeviceMobile size={13} stroke={1.8} /> },
  { label: "UI/UX Kits", icon: <IconPalette size={13} stroke={1.8} /> },
  { label: "Custom Projects", icon: <IconFolderStar size={13} stroke={1.8} /> },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Developer Portfolio Website",
    category: "Website Template",
    version: "v2.43",
  },
  {
    id: 2,
    name: "E-Commerce Website",
    category: "Website Template",
    version: "v0.41",
  },
  { id: 3, name: "SaaS Template", category: "SaaS Template", version: "v2.41" },
  { id: 4, name: "UI/UX Kits", category: "UI/UX Design", version: "v2.43" },
];

const normalizeProducts = (products) =>
  (Array.isArray(products) ? products : []).map((product, index) => ({
    id: product?.id ?? product?.product_id ?? product?.asset_id ?? `product-${index + 1}`,
    title: product?.title ?? product?.name ?? `Product ${index + 1}`,
    category:
      product?.category ??
      product?.asset_type ??
      product?.type ??
      product?.meta ??
      "Uncategorized",
    version: product?.version ?? product?.updated_ago ?? "N/A",
    featured_image: product?.featured_image ?? null,
  }));

const matchesFilter = (activeFilter, product) => {
  if (activeFilter === "All Assets") return true;

  const category = String(product.category || "").toLowerCase();
  if (activeFilter === "Web Apps") return /web|website|saas/.test(category);
  if (activeFilter === "Mobile Apps") return /mobile|ios|android/.test(category);
  if (activeFilter === "UI/UX Kits") return /ui|ux|design/.test(category);
  if (activeFilter === "Custom Projects") return /custom/.test(category);

  return true;
};

export default function ProductSelector({
  onClose,
  onSelect,
  products = PRODUCTS,
  selectedIds = [],
  loading = false,
}) {
  const [activeFilter, setActiveFilter] = useState("All Assets");
  const [search, setSearch] = useState("");
  const normalizedProducts = useMemo(() => normalizeProducts(products), [products]);
  const fallbackSelected = useMemo(
    () => normalizedProducts.slice(0, 2).map((item) => String(item.id)),
    [normalizedProducts],
  );
  const [selected, setSelected] = useState(
    selectedIds.length ? selectedIds.map((id) => String(id)) : fallbackSelected,
  );

  useEffect(() => {
    if (selectedIds.length) {
      setSelected(selectedIds.map((id) => String(id)));
      return;
    }
    setSelected(fallbackSelected);
  }, [selectedIds, fallbackSelected]);

  const toggleSelect = (id) => {
    const normalizedId = String(id);
    setSelected((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((x) => x !== normalizedId)
        : [...prev, normalizedId],
    );
  };

  const filteredProducts = normalizedProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && matchesFilter(activeFilter, product);
  });

  return (
    <div className="ps-overlay" onClick={onClose}>
      <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ps-header">
          <div className="ps-td">
            <span className="ps-title">Select Product (Select Multiple)</span>
            <p className="ps-description">
              Select products the voucher can be applied
            </p>
          </div>
          <button className="ps-close" onClick={onClose}>
            &#10005;
          </button>
        </div>

        <div className="ps-search-wrap">
          <span className="ps-search-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#aaa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="ps-search"
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ps-filters">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              className={`ps-filter-btn${activeFilter === f.label ? " active" : ""}`}
              onClick={() => setActiveFilter(f.label)}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
          <button className="ps-filter-more">
            <IconAdjustmentsHorizontal size={13} stroke={1.8} />
            More Filters
          </button>
        </div>

        <div className="ps-list">
          {loading ? (
            <div className="ps-empty-state">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="ps-empty-state">No products found.</div>
          ) : (
            filteredProducts.map((product) => {
              const isSelected = selected.includes(String(product.id));
              return (
                <div
                  key={product.id}
                  className={`ps-item${isSelected ? " selected" : ""}`}
                  onClick={() => toggleSelect(product.id)}
                >
                  <div className="ps-thumb">
                    {product.featured_image && (
                      <img src={product.featured_image} alt="" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ps-info">
                    <span className="ps-name">{product.title}</span>
                    <span className="ps-meta">
                      {product.category} • {product.version}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="ps-footer">
          <button
            className="ps-select-btn"
            onClick={() =>
              onSelect &&
              onSelect(
                normalizedProducts.filter((product) =>
                  selected.includes(String(product.id)),
                ),
              )
            }
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
