"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export async function getCurrentBudget(accountId){

    try {
        const { userId } = await auth();
              if (!userId) throw new Error("Unauthorized");
          
              const user = await db.user.findUnique({
                where: { clerkUserId: userId },
              });
          
              if (!user) throw new Error("User not found");
              const budget = await db.budget.findFirst({
                where:{
                    userId:user.id,
                },
              });
              const currentDate = new Date();
              const startOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
              );
              const endOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0
              );
              console.log("Date Range:", startOfMonth, endOfMonth);
              console.log(budget);
              
              const expenses = await db.transaction.aggregate({
                where:{
                    userId:user.id,
                    type:"EXPENSE",
                    date:{
                        gte:startOfMonth,
                        lte:endOfMonth,
                    },
                    accountId,
                },
                _sum:{
                    amount:true,
                }
              })
              return{
                 budget:budget?{...budget,amount:budget.amount.toNumber()}:null,
                 currentExpenses:expenses._sum.amount
                 ? expenses._sum.amount.toNumber()
                 :0,
              };
        
    } catch (error) {
        console.error("Error fetching budget:",error);
        throw error;
        
    }

}
export async function updatebudget(amount) {
    try {
        // Retrieve the userId from authentication
        const { userId } = await auth(); 
        if (!userId) throw new Error("Unauthorized");
        
        // Find the user in the database
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) throw new Error("User not found");

        // Upsert the budget (update if exists, create if not)
        const budget = await db.budget.upsert({
            where: {
                userId: user.id,
            },
            update: {
                amount,
            },
            create: {
                userId: user.id,
                amount,
            },
        });

        // Revalidate the path to ensure updated data is fetched
        revalidatePath("/dashboard");

        return {
            success: true,
            data: { ...budget, amount: budget.amount.toNumber() },
        };
    } catch (error) {
        console.error("Error updating budget:", error);
        return { success: false, error: error.message };
    }
}
