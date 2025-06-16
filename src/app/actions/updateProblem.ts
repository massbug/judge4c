'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProblemUpdateSchema = z.object({
  problemId: z.string(),
  displayId: z.number().optional(), // 改回可选字段
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  isPublished: z.boolean().optional(),
  timeLimit: z.number().optional(),
  memoryLimit: z.number().optional(),
  description: z.string().optional(),
  solution: z.string().optional(),
  detail: z.string().optional(),
  templates: z.array(z.object({
    language: z.enum(['c', 'cpp']),
    content: z.string()
  })).optional(),
  testcases: z.array(z.object({
    expectedOutput: z.string(),
    inputs: z.array(z.object({
      index: z.number(),
      name: z.string(),
      value: z.string()
    }))
  })).optional()
});

export type UpdateProblemData = z.infer<typeof ProblemUpdateSchema>;

export async function updateProblem(data: z.infer<typeof ProblemUpdateSchema>) {
  try {
    const validatedData = ProblemUpdateSchema.parse(data);
    
    // 使用upsert代替update实现存在时更新，不存在时创建
    const problem = await prisma.problem.upsert({
      where: { id: validatedData.problemId },
      create: {
        id: validatedData.problemId, // 需要显式指定ID
        displayId: validatedData.displayId || 0,
        difficulty: validatedData.difficulty || 'EASY',
        isPublished: validatedData.isPublished || false,
        timeLimit: validatedData.timeLimit || 1000,
        memoryLimit: validatedData.memoryLimit || 134217728,
        // 初始化关联数据
        localizations: validatedData.description ? {
          create: [{
            locale: 'en',
            type: 'DESCRIPTION',
            content: validatedData.description
          }]
        } : undefined,
        templates: validatedData.templates ? {
          create: validatedData.templates.map(t => ({
            language: t.language,
            content: t.content
          }))
        } : undefined,
        testcases: validatedData.testcases ? {
          create: validatedData.testcases.map(t => ({
            expectedOutput: t.expectedOutput,
            inputs: {
              create: t.inputs.map(i => ({
                index: i.index,
                name: i.name,
                value: i.value
              }))
            }
          }))
        } : undefined
      },
      update: {
        displayId: validatedData.displayId,
        difficulty: validatedData.difficulty,
        isPublished: validatedData.isPublished,
        timeLimit: validatedData.timeLimit,
        memoryLimit: validatedData.memoryLimit,
        // 更新关联数据
        localizations: validatedData.description ? {
          upsert: {
            where: { problemId_locale_type: {
              problemId: validatedData.problemId,
              locale: 'en',
              type: 'DESCRIPTION'
            }},
            create: {
              locale: 'en',
              type: 'DESCRIPTION',
              content: validatedData.description
            },
            update: {
              content: validatedData.description
            }
          }
        } : undefined,
        templates: validatedData.templates ? {
          deleteMany: {},
          create: validatedData.templates.map(t => ({
            language: t.language,
            content: t.content
          }))
        } : undefined,
        testcases: validatedData.testcases ? {
          deleteMany: {},
          create: validatedData.testcases.map(t => ({
            expectedOutput: t.expectedOutput,
            inputs: {
              create: t.inputs.map(i => ({
                index: i.index,
                name: i.name,
                value: i.value
              }))
            }
          }))
        } : undefined
      }
    });

    revalidatePath(`/problem-editor/${validatedData.problemId}`);
    return { success: true, problem };
  } catch (error) {
    console.error('Failed to update problem:', error);
    return { success: false, error: 'Failed to update problem' };
  }
}