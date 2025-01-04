"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
const serializetransaction =(obj)=>{
    const serialized = {...obj};
    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }
    if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
}

export async function createAccount(data){

    try {
        const{userId} = await auth();
        if(!userId) throw new Error("Unauthorized");
        const user = await db.user.findUnique({
            where: { clerkUserId: userId},
        });
        if(!user){
            throw new Error("User not found");
        }
        const balancefloat = parseFloat(data.balance)
        if(isNaN(balancefloat)){
            throw new Error("Invalid balance");
        }
        const existingAccounts = await db.account.findMany({
            where:{userId:user.id},
        })
        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;
        if(shouldBeDefault){
            await db.account.updateMany({
                where: { userId: user.id},
                data: {isDefault: false},
            });
        }

        const account = await db.account.create({
            data:{
                ...data,
                balance:balancefloat,
                userId:user.id,
                isDefault:shouldBeDefault,
            }
        })
        const serializedaccount = serializetransaction(account);
        revalidatePath("/dashboard");
        return {success:true,data:serializedaccount};

    } catch (error) {
        throw new Error(error.message);
    }
}



export async function getUserAccounts(){
    const{userId} = await auth();
        if(!userId) throw new Error("Unauthorized");
        const user = await db.user.findUnique({
            where: { clerkUserId: userId},
        });
        if(!user){
            throw new Error("User not found");
        }
        const accounts = await db.account.findMany({
            where:{ userId :user.id},
            orderBy:{createdAt: "desc" },
            include:{
                _count:{
                    select:{
                       transcations: true,
                    }
                }
            }
        })
        const serializedaccount = accounts.map(serializetransaction);
        return serializedaccount;

}


export async function getDashboardData(){
    const{userId} = await auth();
    if(!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
        where: { clerkUserId: userId},
    });
    if(!user){
        throw new Error("User not found");
    }

    const transactions = await db.transaction.findMany({
        where:{
            userId:user.id,
        },
        orderBy:{
            date:"desc"
        },

    });
    return transactions.map(serializetransaction)

}

