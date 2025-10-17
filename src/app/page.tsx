import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, Settings } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Bienvenido</h1>
          <p className="text-muted-foreground">Elige una opción para continuar</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/support" className="block">
            <Button
              className="w-full h-32 flex flex-col gap-3 text-lg cursor-pointer"
              variant="default"
              size="lg"
            >
              <MessageCircleIcon className="size-8" />
              <span>Chat de Soporte</span>
            </Button>
          </Link>

          <Link href="/admin" className="block">
            <Button
              className="w-full h-32 flex flex-col gap-3 text-lg cursor-pointer"
              variant="outline"
              size="lg"
            >
              <Settings className="size-8" />
              <span>Panel de Administración</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
