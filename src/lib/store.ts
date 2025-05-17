import { create } from 'zustand';
import { editor } from 'monaco-editor';
import { DefaultEditorOptionConfig } from '@/config/editor-option';

interface EditorConfigState {
  config: editor.IEditorConstructionOptions;
  updateConfig: (newConfig: Partial<editor.IEditorConstructionOptions>) => void;
  resetConfig: () => void;
  defaultConfig: editor.IEditorConstructionOptions;
}

export const useEditorConfigStore = create<EditorConfigState>((set) => {
  // 从localStorage读取保存的配置
  const savedConfig = localStorage.getItem('editorConfig');
  const parsedConfig = savedConfig ? JSON.parse(savedConfig) : {};
  
  return {
    config: {
      ...DefaultEditorOptionConfig,
      ...parsedConfig,
    },
    defaultConfig: DefaultEditorOptionConfig,
    updateConfig: (newConfig) => set((state) => {
      const updatedConfig = {
        ...state.config,
        ...newConfig,
      };
      // 保存到localStorage
      localStorage.setItem('editorConfig', JSON.stringify(updatedConfig));
      return { config: updatedConfig };
    }),
    resetConfig: () => set((state) => {
      localStorage.removeItem('editorConfig');
      return { config: state.defaultConfig };
    }),
  };
});

export interface EditorConfigState {
  config: any;
  setConfig: (config: any) => void;
}

export const useEditorConfigStore = create<EditorConfigState>((set) => {
  // 从localStorage读取保存的配置
  let savedConfig = null;
  if (typeof window !== 'undefined') {
    savedConfig = localStorage.getItem('editorConfig');
  }
  
  const parsedConfig = savedConfig ? JSON.parse(savedConfig) : {};
  
  return {
    config: parsedConfig,
    setConfig: (config) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('editorConfig', JSON.stringify(config));
      }
      set({ config });
    }
  };
});
