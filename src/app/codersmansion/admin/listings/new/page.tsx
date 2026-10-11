import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import AdminCreateListing from '@/components/AdminCreateListing';
export const dynamic='force-dynamic';
export default async function Page(){if(!await verifyAdminAuth())redirect('/codersmansion/admin/login');return <div className="max-w-4xl mx-auto p-6 space-y-6"><AdminHeaderNav/><h1 className="text-3xl font-bold">Add listing without payment</h1><AdminCreateListing/></div>;}
