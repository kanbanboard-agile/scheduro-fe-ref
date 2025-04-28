import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ToDoListCard({ isLoading, tasks = [] }) {
  return (
    <Card className="border border-[#6387CE] p-4 rounded-lg">
      {isLoading ? (
        <>
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <ul className="mt-2 space-y-2">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <li
                  key={index}
                  className="flex items-center p-2 bg-white rounded-md shadow space-x-3"
                >
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex flex-col space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <>
          <h3 className="py-3 text-l font-medium text-center">
            Your To Do List
          </h3>
          <ul className="mt-2 space-y-2">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center p-2 bg-white rounded-md shadow space-x-3"
                >
                  <img
                    src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742238508/your-todo-list_rgg7ab.svg"
                    alt="To Do Icon"
                    className="w-8 h-8"
                  />
                  <div className="py-0.5 flex flex-col">
                    <span className="text-sm font-medium">{task.title}</span>
                    <span className="text-xs text-gray-500">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "No Deadline"}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-sm text-gray-500">
                No tasks to do
              </li>
            )}
          </ul>
        </>
      )}
    </Card>
  );
}
