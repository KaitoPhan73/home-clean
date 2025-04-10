/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React from 'react';

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue: string) => {
    if (!value) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  const contextValue = React.useMemo(() => {
    return { value: activeTab, onValueChange: handleTabChange };
  }, [activeTab]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex flex-wrap border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function TabsTrigger({ value, children, disabled = false }: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 border-b-2 font-medium text-sm ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  const { value: activeValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  if (!isActive) return null;

  return <div role="tabpanel">{children}</div>;
}