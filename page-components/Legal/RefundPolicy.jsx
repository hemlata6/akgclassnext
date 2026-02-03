import React from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import { Footer } from '../../components/Shared/SharedComponents';

const RefundPolicy = () => {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen pb-10 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 to-white border-b border-slate-200">
        <div className={LAYOUT_PADDING}>
          <div className="py-8">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-amber-700 mb-4 transition-colors"
            >
              <Icons.ChevronLeft size={16} />
              Back to Home
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Refund & Cancellation Policy</h1>
            <p className="text-slate-600 text-sm">Last updated: January 16, 2026</p>
          </div>
        </div>
      <div className={LAYOUT_PADDING}>
        <div className="max-w-4xl mx-auto py-12">
          <div className="prose prose-slate max-w-none">
            
            <section className="mb-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                Thank you for shopping at www.iWision.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Non-tangible irrevocable goods ("Digital products")</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not issue refunds for non-tangible irrevocable goods ("digital products") once the order is confirmed and the product is sent.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                We recommend contacting us for assistance if you experience any issues receiving or downloading our products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact us for any issues:</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions about our Returns and Refunds Policy, please contact us:
              </p>
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <p className="text-slate-700"><strong>By email:</strong> admin@iWision.com</p>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default RefundPolicy;

