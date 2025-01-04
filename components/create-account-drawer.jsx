'use client'
import React, { useEffect } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Button } from './ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { accountSchema } from '@/app/lib/schema'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import useFetch from '@/hooks/use-fetch'
import { createAccount } from '@/actions/dashboard'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

  
const CreateAccountDrawer = ({children}) => {
   const[open,setopen] = useState(false);

   const{register,handleSubmit,formState:{errors},setValue,watch,reset} = useForm({
    resolver:zodResolver(accountSchema),
    defaultValues:{
      name:"",
      type:"CURRENT",
      balance:"",
      isDefault:false,
    },
   });
   const{data:newAccount,error,loading:createAccountLoading,fn:createAccountfn} =  useFetch(createAccount);
   useEffect(()=>{

    if(newAccount && !createAccountLoading){
      toast.success('Account created successfully')
      reset();
      setopen(false);
    }

   },[createAccountLoading,newAccount])
   useEffect(()=>{

    if(error){
      toast.error(error.message || "Faliled to create account");
    }
   },[error])
   const onSubmit =async (data)=>{
    await createAccountfn(data);
   }

   

  return (

    
    
      <Drawer open={open} onOpenChange={setopen}>
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Create New Account</DrawerTitle>
    </DrawerHeader>
    <div className='px-4 pb-4'>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
<div className='space-y-2'>
  <label className='text-sm font-medium' htmlFor="name">Account Name</label>
  <Input id="name" placeholder="e.g., Main Checking" {...register("name")}/>
  {errors.name && (
    <p className='text-sm text-red-500'>{errors.name.message}</p>
  )}

</div>
<div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>

<div className='space-y-2'>
  <label className='text-sm font-medium' htmlFor="type">Account Type</label>
  <Select onValueChange={(value)=>setValue("type",value)}
    defaultValue={watch("type")}
    >
  <SelectTrigger id="type">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CURRENT">Current</SelectItem>
    <SelectItem value="SAVINGS">Savings</SelectItem>
  </SelectContent>
</Select>

  {errors.type && (
    <p className='text-sm text-red-500'>{errors.type.message}</p>
  )}


</div>
<div className='flex items-center justify-between rounded-lg border p-3'>
  <div className='space-y-0.5'>
      <label className='text-sm font-medium cursor-pointer' htmlFor="balance">Set as Default</label>
  <p className='text-sm text-muted-foreground'>This account will be selected by default for transactions</p>
  </div>

  <Switch id="isDefault" onCheckedChange={(checked)=>setValue("isDefault",checked)}
    defaultValue={watch("isDefault")}/>

  
</div>
<div className='flex gap-4 pt-4'>
  <DrawerClose asChild>
    <Button type="button" variant="outline" className="flex-1">Cancel</Button>
     </DrawerClose>
    <Button type="submit" className="flex-1" disabled={createAccountLoading}>{createAccountLoading?(
      <>
      <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
      Creating...
      </>
    ):("Create Account")}</Button>

 
</div>



      </form>
    </div>
  </DrawerContent>
</Drawer>


  )
}

export default CreateAccountDrawer