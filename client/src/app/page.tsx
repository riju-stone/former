"use client";

import { fetchAllFormBuilds } from "@/db/queries";
import { useEffect, useState } from "react";
import Link from "next/link";
import
{
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/store/formStore";

export default function Home()
{
    const formStore = useFormStore();
    const { resetFormStore } = formStore;

    const [buildData, setBuildData] = useState([]);
    const router = useRouter();

    useEffect(() =>
    {
        const fetchDataFromDB = async () =>
        {
            const builds = await fetchAllFormBuilds();

            console.log(builds);
            setBuildData(builds);
        };

        fetchDataFromDB();
    }, []);

    const handleCreateNewBuild = () =>
    {
        resetFormStore();
        router.push("/builder");
    };

    return (
        <div className="w-screen h-screen bg-white flex flex-col justify-center items-center">
            <p className="text-[4rem] md:text-[7rem] font-[800] text-gray-950 leading-tight">
                former
            </p>
            <p className="text-[1.2rem] md:text-[2rem] font-[400] text-gray-950">
                A simple form builder
            </p>
            <button
                className="absolute top-4 right-4 px-4 py-2 text-white bg-green-500 rounded-xl shadow-button"
                onClick={() => handleCreateNewBuild()}
            >
                Create New Form
            </button>
            <p className="text-[1.5rem] md:text-[2rem] font-[500] text-gray-950">
                Published Forms
            </p>
            <div className="w-full md:w-[75%]">
                <Table>
                    <TableHeader className="w-full">
                        <TableRow>
                            <TableHead>Form Name</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {buildData.map((form) =>
                        {
                            return (
                                <TableRow key={`build-row-${form.id}`}>
                                    <TableCell> <Link href={`/builder/${form.id}`}>{form.formName == "" ? "Untitled Form" : form.formName}</Link></TableCell>
                                    <TableCell>{format(form.updatedAt, "PPP")}</TableCell>
                                </TableRow>

                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
