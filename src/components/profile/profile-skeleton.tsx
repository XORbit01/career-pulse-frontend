
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
  <div className="container max-w-4xl mx-auto pt-24 pb-16 px-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Skeleton className="h-32 w-full rounded-lg mb-6" />
        <div className="flex gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="mb-4">
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2 mb-2" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 mt-1 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default ProfileSkeleton;
