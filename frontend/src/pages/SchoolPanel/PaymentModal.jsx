import { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, CreditCard, Building2 } from 'lucide-react';
import { api } from '../../config/api';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function PaymentModal({ open, onClose, schoolId, amount, onPaymentSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  if (!open) return null;

  const handleClose = () => {
    setFile(null);
    setStatus(null);
    setLoading(false);
    onClose();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Checked here so an oversized or wrong-typed file is rejected instantly
    // rather than after a slow upload that the server then refuses.
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setStatus({ type: 'error', msg: 'Upload a JPG, PNG, WebP or PDF file.' });
      e.target.value = '';
      return;
    }
    if (selected.size > MAX_UPLOAD_BYTES) {
      setStatus({ type: 'error', msg: 'That file is larger than 15 MB. Please upload a smaller one.' });
      e.target.value = '';
      return;
    }

    setStatus(null);
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) {
      setStatus({ type: 'error', msg: 'Please upload a payment screenshot.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // Step 1: store the file, then Step 2: record the payment against its URL.
      const formData = new FormData();
      formData.append('file', file);

      const uploaded = await api.post('/api/upload', formData);

      await api.post(`/api/schools/${schoolId}/payment`, {
        paymentProofUrl: uploaded.url,
        amount,
      });

      setStatus({ type: 'success', msg: 'Payment uploaded successfully! Admin will verify it shortly.' });

      setTimeout(() => {
        onPaymentSuccess();
        handleClose();
      }, 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity" onClick={handleClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Proceed to Payment</h3>
              <p className="text-xs text-gray-500 mt-1">Total Amount: <span className="font-semibold text-gray-900">₹{amount?.toLocaleString('en-IN')}</span></p>
            </div>
            <button onClick={handleClose} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600">
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="px-6 py-5">
            {/* Payment Details */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border border-blue-100 bg-blue-50/50">
                <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
                  <Building2 size={16} /> Bank Transfer
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Bank: <span className="font-medium text-gray-900">State Bank of India</span></p>
                  <p>A/C Name: <span className="font-medium text-gray-900">NTI Olympiad</span></p>
                  <p>A/C No: <span className="font-medium text-gray-900">30294810293</span></p>
                  <p>IFSC: <span className="font-medium text-gray-900">SBIN0001234</span></p>
                </div>
              </div>
              <div className="p-4 rounded-md border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-2 mb-2 text-emerald-800 font-semibold text-sm">
                  <CreditCard size={16} /> UPI / GPay
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>UPI ID: <span className="font-medium text-gray-900">ntiolympiad@sbi</span></p>
                  <div className="mt-3 w-20 h-20 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-400 mx-auto">
                    QR Code
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">Upload Payment Screenshot</p>
              <label
                htmlFor="payment-screenshot"
                className="flex flex-col items-center justify-center gap-3 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Upload size={18} strokeWidth={2} />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-medium text-gray-700">
                    {file ? file.name : 'Click to upload screenshot/proof'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">.pdf, .doc, .docx files up to 5MB (or image)</p>
                </div>
              </label>
              <input
                id="payment-screenshot"
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Status Message */}
            {status && (
              <div className={`flex items-center gap-2 mt-4 px-3 py-2 rounded text-xs font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {status.msg}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Submit Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
