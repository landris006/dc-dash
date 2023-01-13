import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  classNames?: string;
}
const Modal = ({ children, isOpen, onClose, classNames = '' }: Props) => {
  const modal = useRef<HTMLDivElement>(null);

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
    <div
      ref={modal}
      className="fixed top-1/2 left-1/2 z-auto h-screen w-screen -translate-x-1/2 -translate-y-1/2 bg-slate-300 bg-opacity-5 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === modal.current) {
          onClose();
        }
      }}
    >
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded ${classNames}`}
      >
        {children}
      </div>
    </div>,
    document.querySelector('#__next') ?? document.body
  );
};

export default Modal;
