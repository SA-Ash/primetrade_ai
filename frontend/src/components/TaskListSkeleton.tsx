import { Skeleton } from "./ui/Skeleton.js"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card.js"

const TaskListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="w-3/4 h-6" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-[180px]" />
            <div className="flex space-x-2">
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-16 h-8" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default TaskListSkeleton
