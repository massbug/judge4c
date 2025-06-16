"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

interface EditTestcasePanelProps {
  problemId: string;
  onUpdate?: (data: { 
    content: string; 
    inputs: Array<{ index: number; name: string; value: string }>
  }) => void;
}

export const EditTestcasePanel = ({
  problemId,
}: EditTestcasePanelProps) => {
  const [testcases, setTestcases] = useState<TestCase[]>([
    { id: "1", input: "input1", expectedOutput: "output1" },
    { id: "2", input: "input2", expectedOutput: "output2" }
  ]);
  
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");

  const addTestCase = () => {
    if (!newInput || !newOutput) return;
    
    const newTestCase = {
      id: (testcases.length + 1).toString(),
      input: newInput,
      expectedOutput: newOutput
    };
    
    setTestcases([...testcases, newTestCase]);
    setNewInput("");
    setNewOutput("");
  };
  
  const deleteTestCase = (id: string) => {
    setTestcases(testcases.filter(tc => tc.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="testcase-input">输入</Label>
          <Input
            id="testcase-input"
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            placeholder="输入测试用例"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="testcase-output">预期输出</Label>
          <Input
            id="testcase-output"
            value={newOutput}
            onChange={(e) => setNewOutput(e.target.value)}
            placeholder="预期输出"
          />
        </div>
        <Button onClick={addTestCase} className="self-end">
          添加
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>编号</TableHead>
              <TableHead>输入</TableHead>
              <TableHead>预期输出</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testcases.map((tc) => (
              <TableRow key={tc.id}>
                <TableCell>{tc.id}</TableCell>
                <TableCell>{tc.input}</TableCell>
                <TableCell>{tc.expectedOutput}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteTestCase(tc.id)}
                  >
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Button>保存测试用例</Button>
    </div>
  );
};