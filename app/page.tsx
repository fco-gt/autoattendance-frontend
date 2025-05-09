import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/providers/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between w-full">
      <header className="sticky top-0 z-50 w-full bg-background border-b">
        <div className="max-w-7xl mx-auto w-full px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Panel de Agencias</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild variant="outline">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex items-center justify-center">
        <section className="w-full">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 lg:py-32">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4 text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Administra Tu Agencia y Usuarios
                </h1>
                <p className="mx-auto max-w-md text-muted-foreground md:text-xl lg:mx-0">
                  Un panel completo para que las agencias administren sus
                  empleados y usuarios.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row justify-center lg:justify-start">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Comenzar
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Panel de Agencia</h3>
                      <p className="text-sm text-muted-foreground">
                        Administra tu agencia y empleados
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Crear Agencia",
                        desc: "Registra tu agencia y comienza a administrar usuarios",
                      },
                      {
                        title: "Invitar Empleados",
                        desc: "Envía invitaciones a los miembros de tu equipo",
                      },
                      {
                        title: "Administrar Cuentas",
                        desc: "Controla accesos y permisos",
                      },
                    ].map((item) => (
                      <div key={item.title} className="rounded-lg border p-3">
                        <div className="font-medium">{item.title}</div>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full bg-muted border-t">
        <div className="max-w-7xl mx-auto w-full px-4 flex h-16 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © 2025 Panel de Agencias. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Términos
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
