import { getDashboardStats } from "../src/actions/teacher-dashboard";

async function testDashboardData() {
  try {
    console.log("测试 Teacher Dashboard 数据...");
    const data = await getDashboardStats();
    
    console.log(`\n题目数据数量: ${data.problemData.length}`);
    console.log("题目数据:");
    data.problemData.forEach((problemData, index) => {
      console.log(`${index + 1}. 题目${problemData.problemDisplayId}: 完成${problemData.completed}人, 未完成${problemData.uncompleted}人, 总计${problemData.total}人`);
    });
    
    console.log(`\n易错题数量: ${data.difficultProblems.length}`);
    console.log("易错题数据:");
    data.difficultProblems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.problemTitle}: 错误${problem.problemCount}次`);
    });
    
  } catch (error) {
    console.error("测试失败:", error);
  }
}

testDashboardData(); 