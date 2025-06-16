"use server"

import prisma  from "@/lib/prisma";

const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

async function judgeRandom(
    problemId: string
): Promise<[unknown] | null>{
    const problems = await prisma.problem.findFirstOrThrow({
        select:{
            answerType: true, 
            lengthOfArray: true
        },
      where: {
        id: problemId
      },
    });
    const {answerType, lengthOfArray} = problems;

    if (answerType.includes("NS")) {
        return Promise.resolve(null);
    }

    if (lengthOfArray === null){
        return Promise.reject("The length of array is not provided.")
    }

    const array:[unknown[]] = [new Array<unknown>(answerType.length)];

    for (const answerTypeElement of answerType) {
        if (answerTypeElement === "INT") {
            const single = new Array(1)
            single.push(generateRandomInteger())
            array.push(single)
        }
        else if(answerTypeElement === "FLOAT") {
            const single = new Array(1)
            single.push(generateRandomFloat())
            array.push(single)
        }
        else if(answerTypeElement === "CHAR") {
            const single = new Array(1)
            single.push(generateRandomChar())
            array.push(single)
        }
        else if(answerTypeElement === "STRING") {
            const single = new Array(1)
            single.push(generateRandomString())
            array.push(single)
        }
        else if(answerTypeElement === "INTARRAY") {
            const tuple = new Array(lengthOfArray.length)
            for (const lengthOfArrayElement of lengthOfArray) {
                tuple.push(generateRandomIntegerArray(lengthOfArrayElement))
            }
            array.push(tuple)
        }
        else if(answerTypeElement === "FLOATARRAY") {
            const tuple = new Array(lengthOfArray.length)
            for (const lengthOfArrayElement of lengthOfArray) {
                tuple.push(generateRandomFloatArray(lengthOfArrayElement))
            }
            array.push(tuple)
        }
        else if(answerTypeElement === "STRINGARRAY") {
            const tuple = new Array(lengthOfArray.length)
            for (const lengthOfArrayElement of lengthOfArray) {
                tuple.push(generateRandomStringArray(lengthOfArrayElement))
            }
            array.push(tuple)
        }
    }

    return Promise.resolve(array)
}

function generateRandomInteger(
    digit: number = 10000,
) {
    return Math.floor(Math.random() * digit)
}

function generateRandomFloat(
    digit: number = 10000
) {
    return Number.parseFloat((Math.random() * digit).toString())
}

function generateRandomChar(
    onlyChar: boolean = false,
) {
    if (onlyChar){
        return charset.at(Math.random() * 52)
    }
    return charset.at(Math.random() * charset.length)
}

function generateRandomIntegerArray(
    count: number
){
    const intArray: number[] = new Array(count);
    if (count < 0){
        return null
    }
    for (let i = 0; i < count; i++) {
        intArray[i] = generateRandomInteger();
    }
    return intArray
}

function generateRandomFloatArray(
    count: number
){
    const floatArray: number[] = new Array(count);
    if (count < 0){
        return null
    }
    for (let i = 0; i < count; i++) {
        floatArray[i] = generateRandomFloat();
    }
    return floatArray
}

function generateRandomString(
    MaxLength: number = 10
){
    let randomString: string = ''
    const randomLength = Math.floor(Math.random() * MaxLength) + 1
    for (let i = 0; i < randomLength; i++) {
        randomString += generateRandomChar()
    }
    return randomString
}

function generateRandomStringArray(
    count: number
){
    const stringArray: string[] = Array(count)
    for (let i = 0; i < count; i++) {
        stringArray[i] = generateRandomString()
    }
    return stringArray
}

