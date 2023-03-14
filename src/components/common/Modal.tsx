import { forwardRef, HTMLAttributes, Ref, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  blurBackground?: boolean;
}
const Modal = (
  { children, isOpen, onClose, className, blurBackground = true }: Props,
  ref: Ref<HTMLDivElement>
) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  });

  if (!isOpen) {
    return <></>;
  }

  return createPortal(
    <>
      {blurBackground && (
        <div className="fixed top-1/2 left-1/2 z-40 h-screen w-screen -translate-x-1/2 -translate-y-1/2 bg-slate-300 bg-opacity-5 backdrop-blur-[5px]"></div>
      )}

      <div
        ref={ref}
        className={`absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 ${className}`}
      >
        {children}
      </div>
    </>,
    document.body
  );
};

export default forwardRef(Modal);
