import { Loader } from "./loader";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Cargando..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center justify-center p-6 rounded-lg">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/50 opacity-75 blur-sm animate-pulse" />
          <Loader size="lg" text={undefined} className="relative" />
        </div>
        <p className="mt-4 text-base font-medium">{message}</p>
      </div>
    </div>
  );
}
