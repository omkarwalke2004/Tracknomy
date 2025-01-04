import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories';
import React from 'react'
import AddTranscationForm from '../_components/transcation-form';
import { getTransaction } from '@/actions/transcation';

const AddTranscationpage = async ({ searchParams: promiseSearchParams }) => {
    // Await the searchParams before accessing its properties
    const searchParams = await promiseSearchParams;
    const accounts = await getUserAccounts();
    const editId = searchParams?.edit;
    console.log(editId);
    let intialdata = null;
    if(editId){
      const transcation= await getTransaction(editId);
      intialdata = transcation;
    }

    return (
        <div className='max-w-3xl mx-auto px-5'>
            <h1 className='text-5xl gradient-title mb-8'>{editId ?"Edit":" Add" }Transaction</h1>

            <AddTranscationForm
                accounts={accounts}
                categories={defaultCategories}
                editMode={!!editId}
                intialdata={intialdata}
            />
        </div>
    );
};

export default AddTranscationpage;
