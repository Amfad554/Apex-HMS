import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variants = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      progressBar: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      progressBar: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      progressBar: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      progressBar: 'bg-blue-500'
    }
  };

  const variant = variants[type] || variants.info;

  return (
    <div className={`fixed top-4 right-4 z-50 min-w-80 max-w-md shadow-lg rounded-lg border ${variant.bg} p-4 animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {variant.icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${variant.text}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${variant.text} opacity-70 hover:opacity-100 transition`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div className="mt-2 h-1 bg-white/50 rounded-full overflow-hidden">
          <div 
            className={`h-full ${variant.progressBar} animate-progress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

// Add these styles to your global CSS or Tailwind config
// For now, we'll use inline styles with the component
const styles = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-progress {
  animation: progress linear;
}
`;