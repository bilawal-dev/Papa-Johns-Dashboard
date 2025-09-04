export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Skeleton */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
        <div className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
        <div className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
        <div className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
      </div> */}

      {/* Map Skeleton */}
      <div className="h-96 bg-gray-200 animate-pulse rounded-xl"></div>

      {/* Progress Tile Skeleton */}
      <div className="gap-6 mb-8">
        <div className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
      </div>

      {/* Projects Table Skeleton */}
      <div>
        <div className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
      </div>
    </div>
  );
}
