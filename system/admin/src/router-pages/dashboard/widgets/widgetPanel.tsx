import { XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react';

import { useDashboard } from '../../../hooks/useDashboard';
import styles from './../wiggler.module.scss';

const randomNumber = (min, max, fixed = 2) => {
  return (Math.random() * (max - min) + min).toFixed(fixed);
};

export const WidgetPanel = ({
  isEditing = false,
  id,
  children,
}: {
  isEditing?: boolean;
  id: string;
  children?: any;
}) => {
  const { deleteWidget } = useDashboard();
  return (
    <div
      style={{
        animationDelay: `${randomNumber(-1, 0)}s`,
        animationDuration: `${randomNumber(0.3, 0.5)}s`,
      }}
      className={`bg-white relative rounded-xl h-full w-full p-4 shadow-md ${
        isEditing ? styles.wiggler + ' shadow-indigo-300' : ''
      }`}
    >
      {isEditing && (
        <button className="top-3 right-3 absolute" onClick={() => deleteWidget(id)}>
          <XMarkIcon className="h-4 text-gray-400 w-4 hover:text-red-600" />
        </button>
      )}
      {children}
    </div>
  );
};
