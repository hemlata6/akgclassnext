import React from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import { Footer } from '../../components/Shared/SharedComponents';
import { useAuth } from '@/config/AuthContext';

const TermsOfUse = () => {
  const router = useRouter();
  const { institute } = useAuth();

  return (
    <div className="bg-white min-h-screen pb-16 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-white border-b border-slate-200">
        <div className={LAYOUT_PADDING}>
          <div className="py-8">
            <button 
              onClick={() => router.push('/')} 
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-700 mb-4 transition-colors"
            >
              <Icons.ChevronLeft size={16} />
              Back to Home
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Terms of Use</h1>
            <p className="text-slate-600 text-sm">Last updated: January 16, 2026</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={LAYOUT_PADDING}>
        <div className="max-w-4xl mx-auto py-12">
          <div className="prose prose-slate max-w-none">
            
            <section className="mb-8">
              <p className="text-slate-700 leading-relaxed mb-4">
                By signing up on the Fast Education Website you are agreeing to be bound by the following terms and conditions ("Terms of Use").
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                As the original purchaser of content sold on Fast Education, you are entitled to access and use the content which is identified in the course and which is on the Fast Education website, at www.Fast Education.com ("Website"). In order to access and use this content, you must register with Fast Education and create a password to use in accessing the content on the Website.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Your password is unique and exclusive to you, and you may not transfer your password to any other person or allow any other person to use your password to access or use content on the Website. You agree to notify Fast Education immediately if any other person makes unauthorized use of your password. Fast Education reserves the right to suspend or revoke your password in the event of any misuse of your password or any use of your password in violation of these Terms and Conditions. In the event of any such suspension or revocation, you will not be entitled to any refund or payment.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                These Terms of Use govern your access to and use of the Website and the content on the Website. By accessing and using the Website, you agree to these Terms of Use. If you do not agree to any of these Terms of Use, you may not access or use the site. Fast Education reserves the right to modify these Terms of Use at any time and in its sole discretion. Your use of the site following any modification will constitute your assent to and acceptance of the modifications.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Upon registration, Fast Education grants you a non-exclusive, non-transferable, non-assignable, personal license to access and use the Fast Education content identified in the content you purchased via an online/offline reader.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Fast Education will not be liable for any delay or interruption in your access to the site or any content located on the site, or for any transmission errors, equipment or software incompatibilities, force majeure or other failure of performance. Fast Education will use reasonable efforts to correct any failure of performance, but Fast Education will not be required to make any changes to any equipment or software used by Fast Education or its contractors or agents to ensure compatibility with any equipment or software used by you. You may not use the site or the content on the site for any commercial purpose, including but not limited to the use of any of the content to market or sell goods or services to any person. You agree not to launch any automated system, including without limitation, "robots," "spiders," or "offline readers," to access the site.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Fast Education reserves the right to change, suspend access to, or remove any or all of the content on the Website at any time, for any reason, in its sole discretion. Fast Education also reserves the right to discontinue the Website at any time, either temporarily or permanently. In the event of the removal of any content from the Website or the termination of the Website, you will not be entitled to any refund or payment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Disclaimer and Limitation of Liability</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-4">
                <p className="text-slate-700 leading-relaxed mb-4">
                  YOU AGREE THAT YOUR USE OF THE SITE SHALL BE AT YOUR SOLE RISK, AND Fast Education WILL NOT BE HELD LIABLE IN ANY WAY FOR YOUR USE OF THE SITE OR FOR ANY INFORMATION CONTAINED ON THE SITE. ALL CONTENT CONTAINED IN OR REFERRED TO ON THE SITE IS PROVIDED "AS IS," WITHOUT ANY REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, Fast Education DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. Fast Education MAKES NO WARRANTIES THAT THE SITE WILL BE ERROR-FREE, OR THAT ANY ERRORS WILL BE CORRECTED, OR THAT THE SITE OR THE SERVER FROM WHICH THE SITE IS OPERATED WILL BE FREE OF VIRUSES OR OTHER POTENTIALLY HARMFUL CODES.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  UNDER NO CIRCUMSTANCES, INCLUDING NEGLIGENCE, SHALL Fast Education BE HELD LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES AND EXPENSES OF ANY KIND (INCLUDING, WITHOUT LIMITATION, PERSONAL INJURY OR PROPERTY DAMAGE, LOST PROFITS, AND DAMAGES ARISING FROM COMPUTER VIRUSES, BUSINESS INTERRUPTION, LOST DATA, UNAUTHORIZED ACCESS TO OR USE OF SITE SERVERS OR ANY PERSONAL INFORMATION STORED THEREIN, OR ANY INTERRUPTION OR CESSATION OF OPERATION OF THE SITE) ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OF THE SITE OR ANY INFORMATION CONTAINED ON THE SITE, WHETHER SUCH DAMAGES ARE BASED ON CONTRACT, TORT, STRICT LIABILITY OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Indemnification</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You agree to indemnify, hold harmless and defend Fast Education from and against any and all claims, damages, losses, liabilities, judgments, awards, settlements, costs and expenses (including attorney's fees and court costs) arising out of or resulting from your use of this Website or the violation by you of any of these Terms of Use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation Period</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                YOU AGREE THAT ANY CAUSE OF ACTION ARISING OUT OF OR RELATED TO THIS SITE OR YOUR USE OF THIS SITE MUST COMMENCE WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES, AND WILL THEREAFTER BE PERMANENTLY BARRED.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Entire Agreement</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                These Terms of Use constitute the entire agreement between you and Fast Education concerning your use of the Website and the contents of the Website. If any provision is deemed invalid by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. No waiver of any the Terms of Use shall be deemed a further or continuing waiver of such term or condition or any other term or condition, and any failure by Fast Education to assert any right or provision under these Terms of Use shall not constitute a waiver of such right or provision.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="text-slate-700 mb-2"><strong>Email:</strong> {institute?.email}</p>
                <p className="text-slate-700 mb-2"><strong>Phone:</strong> {institute?.phone}</p>
                <p className="text-slate-700"><strong>Location:</strong> {institute?.location}</p>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfUse;

