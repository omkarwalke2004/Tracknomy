import { getAccountWithTransactions } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_Components/account-chart';

const TransactionTable = dynamic(() => import('../_Components/transcation-table'), {
    suspense: true,
});

const AccountsPage = async ({ params }) => {
    console.log("Params:", params); // Debugging params

    const accountdata = await getAccountWithTransactions(params.id);
    if (!accountdata) {
        notFound();
    }
    const { transcations, ...account } = accountdata;

    return (
        <div className='space-y-8 px-5'>
            <div className='flex gap-4 items-end justify-between'>
                <div>
                    <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>
                        {account.name}
                    </h1>
                    <p className='text-muted-foreground'>
                        {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
                    </p>
                </div>
                <div className='text-right pb-2'>
                    <div className='text-xl sm:text-2xl font-bold'>
                        ${parseFloat(account.balance).toFixed(2)}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {account._count.transcations} Transactions
                    </p>
                </div>
            </div>
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />}>
                <AccountChart transcations={transcations}/>
            </Suspense>

            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />}>
                <TransactionTable transcations={transcations} />
            </Suspense>
        </div>
    );
};

export default AccountsPage;
