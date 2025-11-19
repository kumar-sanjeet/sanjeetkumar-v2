import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

const styles = `
  @keyframes scaleUp {
    from {
      transform: scale(0.2);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

interface CertModalProps {
  certName: string;
  imagePath: string;
  children: React.ReactNode;
}

export function CertModal({ certName, imagePath, children }: CertModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <span
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true);
          }
        }}
        className={clsx(
          'hover:bg-accent-600/20 dark:hover:bg-accent-400/20 inline-block cursor-pointer rounded px-1 transition-all'
        )}
      >
        {children}
      </span>

      {isOpen && (
        <div
          className={clsx(
            'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80',
            'transition-opacity duration-500'
          )}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close certificate modal"
        >
          <div
            className={clsx(
              'relative max-h-[90vh] max-w-4xl p-4',
              'scale-100 transition-transform duration-[2000ms] ease-out'
            )}
            style={{ animation: 'scaleUp 0.5s ease-out' }}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={clsx(
                'absolute -top-10 right-0 text-2xl text-white hover:text-gray-300'
              )}
            >
              ✕
            </button>
            <Image
              src={imagePath}
              alt={certName}
              width={1000}
              height={800}
              className={clsx('max-h-[85vh] max-w-full object-contain')}
            />
          </div>
        </div>
      )}
    </>
  );
}
