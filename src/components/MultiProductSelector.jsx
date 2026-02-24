import React, { useState } from "react";
import "../styles/ProductSelectorModal.css";
import {
  IconStack2,
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

export default function ProductSelector({ onClose, onSelect }) {
  const [activeFilter, setActiveFilter] = useState("All Assets");
  const [selected, setSelected] = useState([1, 2]);
  const [search, setSearch] = useState("");

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

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
          {PRODUCTS.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()),
          ).map((product) => {
            const isSelected = selected.includes(product.id);
            return (
              <div
                key={product.id}
                className={`ps-item${isSelected ? " selected" : ""}`}
                onClick={() => toggleSelect(product.id)}
              >
                <div className="ps-thumb"></div>
                <div className="ps-info">
                  <span className="ps-name">{product.name}</span>
                  <span className="ps-meta">
                    {product.category} • {product.version}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ps-footer">
          <button
            className="ps-select-btn"
            onClick={() => onSelect && onSelect(selected)}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
