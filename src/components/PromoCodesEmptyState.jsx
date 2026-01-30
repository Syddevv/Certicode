import React from "react";
import { Link } from "react-router-dom";
import GrayVoucher from "../assets/GrayVoucher.png";
import NavCart from "../assets/NavCart.png";

const PromoCodesEmptyState = () => {
  return (
    <div className="promoEmpty">
      <div className="promoEmpty__icon" aria-hidden="true">
        <img src={GrayVoucher} alt="" />
      </div>
      <h3 className="promoEmpty__title">No vouchers yet</h3>
      <p className="promoEmpty__desc">
        You don&apos;t have any active promo codes or discounts at the moment.
        Keep an eye on your inbox for exclusive offers!
      </p>
      <Link className="promoEmpty__btn" to="/marketplace">
        <img src={NavCart} alt="" aria-hidden="true" />
        Browse Marketplace
      </Link>
    </div>
  );
};

export default PromoCodesEmptyState;
