import { useState } from 'react';
import { X, Save, BellRing } from 'lucide-react';
import { updateTelegramChatId } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface TelegramSettingsModalProps {
  onClose: () => void;
}

export function TelegramSettingsModal({ onClose }: TelegramSettingsModalProps) {
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!chatId.trim()) {
      setError('Please enter a valid Chat ID');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateTelegramChatId(chatId.trim());
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update Telegram Chat ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BellRing className="w-5 h-5 text-indigo-400" />
              Notification Settings
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Telegram Chat ID
              </label>
              <input
                type="text"
                className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 123456789"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-2">
                You can find your Chat ID by messaging @userinfobot on Telegram.
              </p>
            </div>

            {error && (
              <div className="text-sm text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                Successfully updated!
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
