"use client"
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { updatebudget } from '@/actions/budget';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress"

const BudgetProgress = ({ intialBudget, currentExpenses }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(
        intialBudget?.amount?.toString() || ''
    );
    // currentExpenses=18000;
    const percentUsed = intialBudget
        ? (currentExpenses / intialBudget.amount) * 100
        : 0;

    const { 
        loading: isLoading, 
        fn: updatebudgetfn, 
        data: updateBudget, 
        error 
    } = useFetch(updatebudget);

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        await updatebudgetfn(amount);
    };

    useEffect(() => {
        if (updateBudget?.success) {
            setIsEditing(false); // Close the editing UI
            toast.success('Budget updated successfully');
        }
    }, [updateBudget]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'Failed to update budget');
        }
    }, [error]);

    const handleCancelClick = () => {
        setNewBudget(intialBudget?.amount?.toString() || '');
        setIsEditing(false);
    };
 

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex-1">
                    <CardTitle>Monthly Budget (Default Account)</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) =>
                                        setNewBudget(e.target.value)
                                    }
                                    className="w-32"
                                    placeholder="Enter amount"
                                    autoFocus
                                    disabled={isLoading} // Disable input while loading
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleUpdateBudget}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="loader"></div> // Add a loader icon
                                    ) : (
                                        <Check className="h-4 w-4 text-green-500" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancelClick}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <CardDescription>
                        {intialBudget
                            ? currentExpenses === 0
                                ? 'Budget tracking starts today.'
                                : `$${currentExpenses.toFixed(2)} of $${intialBudget.amount.toFixed(2)} spent`
                            : 'No budget set'}
                    </CardDescription>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditing(true)}
                                    className="h-6 w-6"
                                >
                                    <Pencil className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
               {intialBudget && 
               <div className='space-y-2'>
                <Progress value={percentUsed} className={` progress-bar
                  ${
                    percentUsed>=90
                    ?"bg-red-500"
                    :percentUsed>=75
                    ?"bg-yellow-500"
                    :"bg-green-500"
                  }`
                } />

                <p className='text-xs text-muted-foreground text-right'>
                  {percentUsed.toFixed(1)}% used
                </p>
               </div>
               }
            </CardContent>
        </Card>
    );
};

export default BudgetProgress;
