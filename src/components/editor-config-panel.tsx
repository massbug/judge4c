import React from 'react';
import { useEditorConfigStore } from '@/lib/store';

export const EditorConfigPanel = () => {
  const { config, updateConfig } = useEditorConfigStore();

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ fontFamily: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ fontSize: parseInt(e.target.value) });
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ lineHeight: parseInt(e.target.value) });
  };

  const handleReset = () => {
    useEditorConfigStore.getState().resetConfig();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">编辑器配置</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">字体</label>
        <input
          type="text"
          value={config.fontFamily}
          onChange={handleFontFamilyChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">字体大小</label>
        <input
          type="number"
          min="10"
          max="24"
          value={config.fontSize}
          onChange={handleFontSizeChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">行高</label>
        <input
          type="number"
          min="18"
          max="36"
          value={config.lineHeight}
          onChange={handleLineHeightChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          重置默认配置
        </button>
      </div>
    </div>
  );
};