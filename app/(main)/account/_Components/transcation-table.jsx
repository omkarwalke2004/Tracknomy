"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCcw, Search, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { bulkDeleteTranscation } from "@/actions/accounts";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transcations }) => {

    const router = useRouter();
    const[selectedIds,setselectedIds] = useState([]);
    const [page,setpage] = useState(1);
    console.log(selectedIds);
    
    const[sortconfig,setsortconfig] = useState({
        field:"date",
        direction:"desc"
    })
    const[SearchTerm,setSearchTerm] = useState("");
    const[typeFilter,setTypeFilter] = useState("");
    const[recurringFilter,setRecurringFilter] = useState("");

   const{
    loading:deleteLoading,
    fn:deleteFn,
    data:deleted
   } = useFetch(bulkDeleteTranscation)
   
   const handelBulkDelete =async()=>{
    if(
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions`
      )
    ){
      return;
    }
    deleteFn(selectedIds);

   };
   useEffect(()=>{
    if(deleted && !deleteLoading){
      toast.error("Transactions deleted successfully");

    }

   },[deleted,deleteLoading])

  const filteredSortedTranscations = useMemo(()=>{
    let result = [...transcations];
    
    if(SearchTerm){
        const searchLower = SearchTerm.toLowerCase();
        result = result.filter((transcation)=>
        transcation.description?.toLowerCase().includes(searchLower)
        );
    }

    if(recurringFilter){
        result = result.filter((transcation)=>{
            if(recurringFilter === "recurring")return transcation.isRecurring;
            return !transcation.isRecurring;
        })
    }

    if(typeFilter){
        result=result.filter((transcation)=>transcation.type === typeFilter);
    }

    result.sort((a,b)=>{
        let comparision =0;
        switch (sortconfig.field) {
            case "date":
                comparision = new Date(a.date) - new Date(b.date);
                break;
            case "amount":
                comparision = a.amount - b.amount;
                break;
            case "category":
                comparision = a.category.localeCompare(b.category);
                break;
            default:
                comparision = 0;
        }
return sortconfig.direction === "asc"?comparision:-comparision;
    });


    return result;

  },[
    transcations,
    SearchTerm,
    typeFilter,
    recurringFilter,
    sortconfig
  ]);
  const handelsort = (field) => {
    setsortconfig(current=>({
        field,
        direction:current.field === field && current.direction === "asc" 
         ? "desc" 
          : "asc"
    }))
  };
  const handelselect =(id)=>{
setselectedIds(current=>current.includes(id)? current.filter(item=>item!=id):[...current,id])
  }
  const handelselectAll =()=>{
    setselectedIds(current=>current.length === filteredSortedTranscations.length?[]:filteredSortedTranscations.map((t)=>t.id))

  }
 
  const handleClearFilters=()=>{
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setselectedIds([]);

  }
  const itemsoerpage=10;
  const paginationlength = Math.ceil(filteredSortedTranscations.length/itemsoerpage);
  const selectPageHandler =(selectedpage)=>{
    if(
      selectedpage>=1 &&
      selectedpage<=paginationlength &&
      selectedpage!== page
    )
    setpage(selectedpage);

  }
  return (
    <div className="space-y-4">
      {deleteLoading &&(
        <BarLoader className="mt-4" width={"100%"} color="#9333ea"/>
      )}
        
      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>

            <Input placeholder="Search transcations..." value={SearchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-8"/>
        </div>
        <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="All Types" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="INCOME">Income</SelectItem>
    <SelectItem value="EXPENSE">Expense</SelectItem>
  </SelectContent>
</Select>
<Select value={recurringFilter} onValueChange={(value)=>setRecurringFilter(value)}>
  <SelectTrigger className="w-[150px]">
    <SelectValue placeholder="All Transcations" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="recurring">Recurring Only</SelectItem>
    <SelectItem value="non-recurring">Non-recuuring Only</SelectItem>
  </SelectContent>
</Select>
{selectedIds.length > 0 && (
    <div className="flex items-center gap-2">
        <Button variant="destructive" size="sm" onClick={handelBulkDelete}>
            <Trash className="h-4 w-4 mr-2"/>
            Delete Selected ({selectedIds.length})

        </Button>
    </div>
)}
{(SearchTerm || typeFilter || recurringFilter) &&(
    <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear Filters">
        <X className="h-4 w-4 "/>
    </Button>
)}

        </div>
      </div>

      {/* Transcations */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox  onCheckedChange={handelselectAll} checked={
                    selectedIds.length === filteredSortedTranscations.length && filteredSortedTranscations.length>0
  
                }/>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handelsort("date")}
              >
                <div className="flex items-center">Date {sortconfig.field==='date'&&(
                    sortconfig.direction==="asc"?<ChevronUp className="ml-1 h-4 w-4 "/>:<ChevronDown className="ml-1 h-4 w-4"/>
                )}</div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handelsort("category")}
              >
                <div className="flex items-center">Category{sortconfig.field==='category'&&(
                    sortconfig.direction==="asc"?<ChevronUp className="ml-1 h-4 w-4 "/>:<ChevronDown className="ml-1 h-4 w-4"/>
                )}</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handelsort("amount")}
              >
                <div className="flex items-center justify-end">Amount{sortconfig.field==='amount'&&(
                    sortconfig.direction==="asc"?<ChevronUp className="ml-1 h-4 w-4 "/>:<ChevronDown className="ml-1 h-4 w-4"/>
                )}</div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSortedTranscations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  NO Transcations found
                </TableCell>
              </TableRow>
            ) : (
              filteredSortedTranscations.slice((page - 1) * itemsoerpage, page * itemsoerpage).map((transcation) => (
                <TableRow key={transcation.id}>
                  <TableCell>
                    <Checkbox onCheckedChange={()=>handelselect(transcation.id)} checked={selectedIds.includes(transcation.id)} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transcation.date), "PP")}
                  </TableCell>
                  <TableCell>{transcation.description}</TableCell>
                  <TableCell className="capatalize ">
                    <span
                      style={{
                        background: categoryColors[transcation.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transcation.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transcation.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transcation.type === "EXPENSE" ? "-" : "+"}$
                    {transcation.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transcation.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCcw className="h-3 w-3" />
                              {
                                RECURRING_INTERVALS[
                                  transcation.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transcation.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel onClick={()=>{
                            router.push(`/transaction/create?edit=${transcation.id}`)
                        }}>Edit</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" 
                        onClick={()=>deleteFn([transcation.id])}
                        >Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
            
          </TableBody>
        </Table>
       
      </div>
      {
  filteredSortedTranscations.length > 0 && (
    <div className="p-4 mt-4 mb-4 flex justify-center gap-2">
      {/* Previous Button */}
      <span onClick={()=>selectPageHandler(page-1)} className={page>1 ?"px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition":"opacity-0"}>
        ⬅️
      </span>

      {/* Page Numbers */}
      {[...Array(paginationlength)].map((_, i) => (
        <span onClick={()=>selectPageHandler(i+1)}
          key={i}
          className={`px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
            i+1 === page ? 'bg-purple-600 text-white font-bold' : ''
          }`}
           // Add your onClick logic to set the current page
        >
          {i + 1}
        </span>
      ))}

      {/* Next Button */}
      <span  onClick={()=>selectPageHandler(page+1)} className={page<paginationlength ?"px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition":"opacity-0"}>
        ➡️
      </span>
    </div>
  )
}


    </div>
  );
};

export default TransactionTable;
