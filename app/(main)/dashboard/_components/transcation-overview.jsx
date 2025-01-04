"use client"
import React, { useState } from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { format } from 'date-fns'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9FA8DA",
  ];
  

const Dashboadrdoverview = ({accounts,transactions}) => {
    const[selectedAccountId,setselectedAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
    );

    const accoutTransactions = transactions.filter(
        (t)=> t.accountId === selectedAccountId
    );

    const recentTransactions = accoutTransactions
    .sort((a,b)=>new Date(b.date) - new Date(a.date))
    .slice(0,5);


    const currentDate = new Date();
    const currentMonthExpenses = accoutTransactions.filter((t)=>{
        const transactionDate = new Date(t.date);
        return(
            t.type === "EXPENSE" &&
            transactionDate.getMonth() === currentDate.getMonth() && 
            transactionDate.getFullYear() === currentDate.getFullYear()
        )
    })

    const expensesByCategory = currentMonthExpenses.reduce((acc,transaction)=>{
        const category = transaction.category;
        if(!acc[category]){
            acc[category] =0;
        }
        acc[category] += transaction.amount;
        return acc;
    },{})

    const pieChartData = Object.entries(expensesByCategory).map(
        ([category,amount])=>({
            name: category,
            value: amount,
        })
    )

  return (
    <div className='grid gap-4 md:grid-cols-2'>
        <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>
    <Select value={selectedAccountId} onValueChange={setselectedAccountId}>
  <SelectTrigger className="w-[140px]">
    <SelectValue placeholder="Select account" />
  </SelectTrigger>
  <SelectContent>
    {
        accounts.map((account)=>(
            <SelectItem key={account.id} value={account.id}>
                {account.name}
            </SelectItem>
        ))
    }
  </SelectContent>
</Select>
  </CardHeader>
  <CardContent>
<div className='space-y-4'>
    {recentTransactions.length === 0 ? (
        <p className='text-center text-muted-foreground py-4'>No recent transcations</p>
    ):(
        recentTransactions.map((transaction)=>{
           return( <div key={transaction.id} className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                        {transaction.description || "Untitled Transcation" }
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        {format(new Date(transaction.date),"PP")}
                    </p>


                </div>
                <div className='flex items-center gap-2'>
                    <div className={
                        cn(
                            "flex items-center",
                            transaction.type === "EXPENSE"
                            ? "text-red-500"
                            :"text-green-500"
                        )
                    }>
                        {transaction.type === "EXPENSE" ? (
                            <ArrowDownRight className='mr-1 h-4 w-4'/>
                        ):(
                            <ArrowUpRight className='mr-1 h-4 w-4'/>
                        )}
                        ${transaction.amount.toFixed(2)}

                    </div>

                </div>

            </div>)
        })
    )}
</div>
  </CardContent>
 </Card>

<Card>
  <CardHeader>
    <CardTitle className="text-base font-normal">Monthly Expense Breakdown</CardTitle>
  </CardHeader>
  <CardContent className="p-0 pb-5">
    {
        pieChartData.length === 0 ? (
            <p className='text-center text-muted-foreground py-4'>No expenses this month</p>
        ):(
            <div className='h-[300px]'>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart >
  <Pie 
  data={pieChartData}
  cx="50%"
  cy="50%"
  outerRadius={80}
  fill='#8884d8'
  dataKey="value"
  label={({name,value})=> `${name}: $${value.toFixed(2)}`}
  >
    {
      pieChartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
      ))
    }
  </Pie>
  <Legend/>
</PieChart>


                </ResponsiveContainer>
            </div>
        )
    }
  

  </CardContent>
 
</Card>

      


    </div>
  )
}

export default Dashboadrdoverview