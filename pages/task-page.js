import Layout from "../components/Layout";
import Link from "next/link";

import { getAllTasksData } from "../lib/tasks";
import Task from "../components/Task";

import useSWR from "swr";
import StateContextProvider from "../context/StateContext";
import TaskForm from "../components/TaskForm";

const fetcher = (url) => fetch(url).then((res) => res.json());
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`;

import { useEffect } from "react";

export default function TaskPage({ staticfilterdTasks }) {

    /**
     * client side fetching
     * tasksにclientで取得したtaskの一覧が入っている
     */
    const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
        initialData: staticfilterdTasks,
    });

    /**
     * clientで取得したtask一覧の並び替え
     */
    const filteredTasks = tasks?.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    /** chacheを確実にrefreshする */
    useEffect(() => {
        mutate();
    }, []);

    return (
        /* StateContextProviderにより、selectedTaskが使用できる */ 
        <StateContextProvider>
            <Layout title="Task page">
                <TaskForm taskCreated={mutate} />
                <ul>
                    {filteredTasks &&
                        filteredTasks.map((task) => (
                            <Task key={task.id} task={task} taskDeleted={mutate} />
                        ))
                    }
                </ul>
                <Link href="/main-page">
                    <div className="flex cursor-pointer mt-12">
                        <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                        <span>Back to main page</span>
                    </div>
                </Link>
            </Layout>
        </StateContextProvider>
    );
}

export async function getStaticProps() {
    const staticfilterdTasks = await getAllTasksData();

    return {
        props: { staticfilterdTasks },
        revalidate: 3,
    };
}