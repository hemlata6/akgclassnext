import React, { useState } from 'react';
import { Icons, BRAND_GREEN, BRAND_GREEN_HOVER, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../../constants/Icons';

const BookConfigModal = ({ book, onClose, onAddToCart }) => {
  const pricing = book?.coursePricing?.[0];
  const originalPrice = pricing?.price || 0;
  const discount = pricing?.discount || 0;
  const discountedPrice = originalPrice - (originalPrice * discount / 100);

  const handleAddToCart = () => {
    const cartItem = {
      ...book,
      pricingId: book.id,
      coursePricingId: book.id,
      finalPrice: Math.round(discountedPrice),
      originalPrice,
      discount,
      type: 'Book'
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className={`${BRAND_GREEN_CLASS} p-6 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <Icons.X />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">{book?.title}</h2>
          <p className="text-white/90 text-sm">Study Material</p>
        </div>

        {/* Content */}
        <form className="p-6 space-y-6">
          {/* Book Info */}
          <div className="flex gap-4">
            <div className="h-24 w-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200">
              <span className="text-4xl">📚</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Book</p>
              <p className="text-sm font-bold text-slate-900">{book?.title}</p>
              <p className="text-xs text-slate-500 mt-2">{book?.shortDescription}</p>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="space-y-2">
              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 line-through">₹{originalPrice.toLocaleString()}</span>
                  <span className="text-xs font-bold text-emerald-600">{discount}% OFF</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Total Price</span>
                <span className="text-2xl font-bold text-emerald-700">₹{Math.round(discountedPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Icons.Check />
              </div>
              <span className="text-slate-700 font-medium">High Quality Printed Material</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Icons.Check />
              </div>
              <span className="text-slate-700 font-medium">Free Home Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Icons.Check />
              </div>
              <span className="text-slate-700 font-medium">30-Day Return Policy</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
          >
            Add to Cart <Icons.Cart />
          </button>

          <p className="text-xs text-center text-slate-400 mt-3">Secure Payment • Fast Delivery</p>
        </form>
      </div>
    </div>
  );
};

export default BookConfigModal;

