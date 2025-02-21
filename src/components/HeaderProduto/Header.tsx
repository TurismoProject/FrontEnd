'use client'

import { useState } from 'react'
import { DrawerTrigger } from "../ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ListItem } from "../Header/ListItem";
import { Button } from "../ui/button";
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'
import { List, ShoppingCart, UserRound, Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Input } from "../ui/input";
import { PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'


const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function HeaderProduto() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const color = true; // ou defina baseado na sua lógica

  return (
    <div className="navbar lg:navbar-center px-4">
      <div className="navbar-start lg:hidden">
        <div className="flex-none">
          <DrawerTrigger asChild>
            <Button variant="secondary">
              <List />
            </Button>
          </DrawerTrigger>
        </div>
      </div>
      
      <div className="lg:navbar-start max-lg:navbar-center mr-12 pl-28">
        <Link href="/" className={`text-xl ${color ? "text-black" : "text-white"}`}>
          <Image
            src="/logopreta.png"
            width={80}
            height={80}
            className={ color ? "h-20 w-20" : ""}
            alt="Logo"
          />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${color ? "text-black" : "text-white"}`}>
                Viagens
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/">
                        <div className="mb-2 mt-4 text-lg font-medium">Melhores Lugares</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Os lugares mais bonitos e mais bem avaliados para você conhecer e se divertir com a família.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/" title="Internacionais">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum molestias, eos expedita veniam reiciendis a esse
                  </ListItem>
                  <ListItem href="/" title="Nacionais">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum molestias, eos expedita veniam reiciendis a esse
                  </ListItem>
                  <ListItem href="/" title="Promoções">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum molestias, eos expedita veniam reiciendis a esse
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${color ? "text-black" : "text-white"}`}>
                Hoteis
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/">
                        <div className="mb-2 mt-4 text-lg font-medium">Melhores Hoteis</div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Os hotéis mais bem avaliados para você relaxar e curtir a viagem da melhor forma.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/" title="Pousadas">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum molestias, eos expedita veniam reiciendis a esse
                  </ListItem>
                  <ListItem href="/" title="Pacotes">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum molestias, eos expedita veniam reiciendis a esse
                  </ListItem>
                  <ListItem href="/" title="Promoções">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum molestias, eos expedita veniam reiciendis a esse
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
           
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="../Produto" className={`btn btn-ghost ${color ? "text-black" : "text-white"}`}>
                  Pacotes para Família
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="../Produto" className={`btn btn-ghost ${color ? "text-black" : "text-white"}`}>
                  Ajuda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* Container com 'relative' para posicionar o input */}
      <div className="navbar-end pr-14 relative">
      <div className="input input-bordered bg-white flex items-center gap-2 w-72 rounded-full shadow-lg pl-1 absolute right-64">
  <Search />
  <Input
    type="text"
    placeholder="Pesquise por passeios, Hoteis, pousadas..."
    className="w-full text-xs"
  />
        </div>

        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button className="btn btn-ghost btn-circle hover:bg-gray-200/70 active:bg-gray-200 group">
              <div className={`indicator ${color ? "text-black" : "text-white"} group-hover:text-black`}>
                <UserRound />
              </div>
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <ul className="space-y-2">
              <li><a href="/cadastro" className="text-black font-semibold block p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 transform scale-100">Cadastre-se</a></li>
              <li><a href="/login" className="text-black font-semibold block p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 transform scale-100">Login</a></li>
              <li><a href="/admin" className="text-black font-semibold block p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 transform scale-100">Administração</a></li>
            </ul>
          </HoverCardContent>
        </HoverCard>

        <button className="btn btn-ghost btn-circle hover:bg-gray-200/70 active:bg-gray-200 group">
          <div className={`indicator ${color ? "text-black" : "text-white"} group-hover:text-black`}>
            <ShoppingCart />
          </div>
        </button>
      </div>
    </div>
  )
}