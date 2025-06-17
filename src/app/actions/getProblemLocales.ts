// src/app/actions/getProblemLocales.ts
'use server';

import prisma from "@/lib/prisma";

export async function getProblemLocales(problemId: string): Promise<string[]> {
    const locales = await prisma.problemLocalization.findMany({
        where: { problemId },
        select: { locale: true },
        distinct: ['locale'],
    });

    return locales.map(l => l.locale);
}
