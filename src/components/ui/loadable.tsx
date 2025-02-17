
import { Loader2 } from "lucide-react";

interface LoadableProps {
  loading: boolean;
  children: React.ReactNode;
}

export const Loadable = ({ loading, children }: LoadableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
