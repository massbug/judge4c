// app/actions/get-problem-data.ts
'use server';

import prisma from '@/lib/prisma';
import { serialize } from 'next-mdx-remote/serialize';

export async function getProblemData(problemId: string) {
    const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        include: {
            localizations: true,
            templates: true,
            testcases: {
                include: { inputs: true }
            }
        }
    });

    if (!problem) {
        throw new Error('Problem not found');
    }

    const getContent = (type: string) =>
        problem.localizations.find(loc => loc.type === type)?.content || '';

    const rawDescription = getContent('DESCRIPTION');

    // MDX序列化，给客户端渲染用
    const mdxDescription = await serialize(rawDescription, {
        // 可以根据需要添加MDX插件配置
        parseFrontmatter: false,
    });

    return {
        id: problem.id,
        displayId: problem.displayId,
        difficulty: problem.difficulty,
        isPublished: problem.isPublished,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        title: getContent('TITLE'),
        description: rawDescription,
        mdxDescription,  // 新增序列化后的字段
        solution: getContent('SOLUTION'),
        templates: problem.templates.map(t => ({
            language: t.language,
            content: t.content
        })),
        testcases: problem.testcases.map(tc => ({
            id: tc.id,
            expectedOutput: tc.expectedOutput,
            inputs: tc.inputs.map(input => ({
                name: input.name,
                value: input.value
            }))
        }))
    };
}
