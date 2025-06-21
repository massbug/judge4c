import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  Target,
  Activity
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers?: number;
  totalProblems?: number;
  totalSubmissions?: number;
  totalStudents?: number;
  completedProblems?: number;
}

interface Activity {
  type: string;
  title: string;
  description: string;
  time: Date;
  status?: string;
}

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  
  if (!user) {
    redirect("/sign-in");
  }

  // 获取用户的完整信息
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true, role: true }
  });

  if (!fullUser) {
    redirect("/sign-in");
  }

  // 根据用户角色获取不同的统计数据
  let stats: Stats = {};
  let recentActivity: Activity[] = [];

  if (fullUser.role === "ADMIN") {
    // 管理员统计
    const [totalUsers, totalProblems, totalSubmissions, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.submission.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      })
    ]);

    stats = { totalUsers, totalProblems, totalSubmissions };
    recentActivity = recentUsers.map(user => ({
      type: "新用户注册",
      title: user.name || user.email,
      description: `角色: ${user.role}`,
      time: user.createdAt
    }));
  } else if (fullUser.role === "TEACHER") {
    // 教师统计
    const [totalStudents, totalProblems, totalSubmissions, recentSubmissions] = await Promise.all([
      prisma.user.count({ where: { role: "GUEST" } }),
      prisma.problem.count({ where: { isPublished: true } }),
      prisma.submission.count(),
      prisma.submission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          problem: { 
            select: { 
              displayId: true,
              localizations: { where: { type: "TITLE", locale: "zh" }, select: { content: true } }
            }
          }
        }
      })
    ]);

    stats = { totalStudents, totalProblems, totalSubmissions };
    recentActivity = recentSubmissions.map(sub => ({
      type: "学生提交",
      title: `${sub.user.name || sub.user.email} 提交了题目 ${sub.problem.displayId}`,
      description: sub.problem.localizations[0]?.content || `题目${sub.problem.displayId}`,
      time: sub.createdAt,
      status: sub.status
    }));
  } else {
    // 学生统计
    const [totalProblems, completedProblems, totalSubmissions, recentSubmissions] = await Promise.all([
      prisma.problem.count({ where: { isPublished: true } }),
      prisma.submission.count({ 
        where: { 
          userId: user.id, 
          status: "AC" 
        }
      }),
      prisma.submission.count({ where: { userId: user.id } }),
      prisma.submission.findMany({
        where: { userId: user.id },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          problem: { 
            select: { 
              displayId: true,
              localizations: { where: { type: "TITLE", locale: "zh" }, select: { content: true } }
            }
          }
        }
      })
    ]);

    stats = { totalProblems, completedProblems, totalSubmissions };
    recentActivity = recentSubmissions.map(sub => ({
      type: "我的提交",
      title: `题目 ${sub.problem.displayId}`,
      description: sub.problem.localizations[0]?.content || `题目${sub.problem.displayId}`,
      time: sub.createdAt,
      status: sub.status
    }));
  }

  const getRoleConfig = () => {
    switch (fullUser.role) {
      case "ADMIN":
        return {
          title: "系统管理后台",
          description: "管理整个系统的用户、题目和统计数据",
          stats: [
            { label: "总用户数", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
            { label: "总题目数", value: stats.totalProblems, icon: BookOpen, color: "text-green-600" },
            { label: "总提交数", value: stats.totalSubmissions, icon: Activity, color: "text-purple-600" }
          ],
          actions: [
            { label: "用户管理", href: "/dashboard/usermanagement/guest", icon: Users },
            { label: "题目管理", href: "/dashboard/usermanagement/problem", icon: BookOpen },
            { label: "管理员设置", href: "/dashboard/management", icon: Target }
          ]
        };
      case "TEACHER":
        return {
          title: "教师教学平台",
          description: "查看学生学习情况，管理教学资源",
          stats: [
            { label: "学生数量", value: stats.totalStudents, icon: Users, color: "text-blue-600" },
            { label: "题目数量", value: stats.totalProblems, icon: BookOpen, color: "text-green-600" },
            { label: "提交数量", value: stats.totalSubmissions, icon: Activity, color: "text-purple-600" }
          ],
          actions: [
            { label: "学生管理", href: "/dashboard/usermanagement/guest", icon: Users },
            { label: "题目管理", href: "/dashboard/usermanagement/problem", icon: BookOpen },
            { label: "统计分析", href: "/dashboard/teacher/dashboard", icon: BarChart3 }
          ]
        };
      default:
        return {
          title: "我的学习中心",
          description: "继续您的编程学习之旅",
          stats: [
            { label: "总题目数", value: stats.totalProblems, icon: BookOpen, color: "text-blue-600" },
            { label: "已完成", value: stats.completedProblems, icon: CheckCircle, color: "text-green-600" },
            { label: "提交次数", value: stats.totalSubmissions, icon: Activity, color: "text-purple-600" }
          ],
          actions: [
            { label: "开始做题", href: "/problemset", icon: BookOpen },
            { label: "我的进度", href: "/dashboard/student/dashboard", icon: TrendingUp },
            { label: "个人设置", href: "/dashboard/management", icon: Target }
          ]
        };
    }
  };

  const config = getRoleConfig();
  const completionRate = fullUser.role === "GUEST" ? 
    ((stats.totalProblems || 0) > 0 ? ((stats.completedProblems || 0) / (stats.totalProblems || 1)) * 100 : 0) : 0;

  return (
    <div className="space-y-6 p-6">
      {/* 欢迎区域 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
        <p className="text-muted-foreground">{config.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{fullUser.role}</Badge>
          <span className="text-sm text-muted-foreground">
            欢迎回来，{fullUser.name || fullUser.email}
          </span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        {config.stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 学生进度条 */}
      {fullUser.role === "GUEST" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              学习进度
            </CardTitle>
            <CardDescription>
              已完成 {stats.completedProblems || 0} / {stats.totalProblems || 0} 道题目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={completionRate} className="w-full" />
            <p className="mt-2 text-sm text-muted-foreground">
              完成率: {completionRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      )}

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用功能快速访问</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {config.actions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button variant="outline" className="w-full justify-start">
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>查看最新的系统活动</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === "AC" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : activity.status ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(activity.time).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">暂无活动</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
