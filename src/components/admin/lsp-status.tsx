import { LspConnectionIndicator } from "@/features/problems/code/components/toolbar/controls/lsp-connection-indicator";

export const LspStatus = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">LSP 连接状态</h3>
      <LspConnectionIndicator />
    </div>
  );
};