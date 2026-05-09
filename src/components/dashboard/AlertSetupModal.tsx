import { useState, useEffect } from 'react';
import { X, Save, Trash2, BellRing } from 'lucide-react';
import { setAlert, removeAlert, getAlerts } from '../../lib/api';
import type { UserStockAlert } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertSetupModalProps {
  symbol: string;
  currentPrice: number;
  onClose: () => void;
}

export function AlertSetupModal({ symbol, currentPrice, onClose }: AlertSetupModalProps) {
  const [highThreshold, setHighThreshold] = useState<string>('');
  const [lowThreshold, setLowThreshold] = useState<string>('');
  const [existingAlert, setExistingAlert] = useState<UserStockAlert | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAlerts()
      .then((alerts) => {
        const found = alerts.find(a => a.symbol === symbol);
        if (found) {
          setExistingAlert(found);
          if (found.high_threshold) setHighThreshold(found.high_threshold.toString());
          if (found.low_threshold) setLowThreshold(found.low_threshold.toString());
        }
      })
      .catch(err => {
        console.error('Failed to load alerts', err);
      })
      .finally(() => setLoading(false));
  }, [symbol]);

  const handleSave = async () => {
    if (!highThreshold && !lowThreshold) {
      setError('Please set at least one threshold (high or low).');
      return;
    }

    const high = highThreshold ? parseFloat(highThreshold) : undefined;
    const low = lowThreshold ? parseFloat(lowThreshold) : undefined;

    if (high !== undefined && isNaN(high)) return setError('Invalid High Threshold');
    if (low !== undefined && isNaN(low)) return setError('Invalid Low Threshold');

    if (high !== undefined && low !== undefined && high <= low) {
      return setError('High threshold must be greater than low threshold');
    }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await setAlert(symbol, high, low);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save alert');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingAlert) return;
    
    setDeleting(true);
    setError('');
    setSuccess(false);

    try {
      await removeAlert(existingAlert.id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to delete alert');
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400">Loading...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-indigo-400" />
                  Alert Setup
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-between items-center bg-dark-900/50 rounded-lg p-3 border border-white/5 mb-6">
                <div className="text-slate-400 font-medium">{symbol}</div>
                <div className="text-white font-bold text-lg">{currentPrice.toLocaleString()}</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    High Price Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors"
                    placeholder={`e.g. ${(currentPrice * 1.05).toFixed(1)}`}
                    value={highThreshold}
                    onChange={(e) => setHighThreshold(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">Alert when price goes above this</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Low Price Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors"
                    placeholder={`e.g. ${(currentPrice * 0.95).toFixed(1)}`}
                    value={lowThreshold}
                    onChange={(e) => setLowThreshold(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">Alert when price drops below this</p>
                </div>
              </div>

              {error && (
                <div className="text-sm text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20 mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20 mb-4">
                  Success!
                </div>
              )}

              <div className="flex gap-3">
                {existingAlert && (
                  <button
                    onClick={handleDelete}
                    disabled={saving || deleting || success}
                    className="flex-1 flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium py-2.5 rounded-lg transition-colors border border-rose-500/20"
                  >
                    {deleting ? (
                      <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || deleting || success}
                  className="flex-[2] flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Alert
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
