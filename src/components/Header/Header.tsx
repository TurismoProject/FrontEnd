"use client";
import * as React from "react";
import { DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { List, ShoppingCart, UserRound } from "lucide-react";
import iconepreto from "@/../public/iconepreto.png";
import iconebranco from "@/../public/iconebranco.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { ListItem } from "./ListItem";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";

export const HeaderComponent = () => {
  const { scrollY } = useScroll();
  const [color, setColor] = React.useState(false);
  const [searchVisible, setSearchVisible] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 400) {
      setColor(true);
    } else {
      setColor(false);
    }
    if (latest > 850) {
      setSearchVisible(true);
    } else {
      setSearchVisible(false);
    }
  });

  const useShadowStyle = () => {
    if (color) {
      if (searchVisible) {
        return "";
      }
      return "shadow-md";
    }
    return "";
  };

  return (
    <>
      <motion.header
        variants={{
          visible: {
            backgroundColor: "white",
          },
          transparent: {
            backgroundColor: "transparent",
          },
        }}
        animate={color ? "visible" : "transparent"}
        className={`fixed w-full z-20 transition-all duration-300 ${useShadowStyle()}`}
      >
        <div
          className={`transition-all duration-300 z-10 navbar max-md:w-full md:w-5/6 max-sm:p-4 lg:w-3/4 mx-auto p-0 ${
            color ? "" : "my-4"
          }`}
        >
          <div className="navbar-start lg:hidden">
            <div className="flex-none">
              <DrawerTrigger asChild>
                <Button variant="secondary">
                  <List />
                </Button>
              </DrawerTrigger>
            </div>
          </div>
          <div className="lg:navbar-start max-lg:navbar-center">
            <Link
              href="/"
              className={`text-xl ${color ? "text-black" : "text-white"}`}
            >
              <Image
                src={color ? iconepreto : iconebranco}
                className={color ? "h-16 w-16" : "h-20 w-20"}
                alt="Logo"
              />
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`${color ? "text-black" : "text-white"}`}
                  >
                    Viagens
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Melhores Lugares
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Os lugares mais bonitos e mais bem avaliados para
                              você conhecer e se divertir com a família.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/" title="Internacionais">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsum molestias, eos expedita veniam reiciendis a esse
                      </ListItem>
                      <ListItem href="/" title="Nacionais">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsum molestias, eos expedita veniam reiciendis a esse
                      </ListItem>
                      <ListItem href="/" title="Promoções">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsum molestias, eos expedita veniam reiciendis a esse
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`${color ? "text-black" : "text-white"}`}
                  >
                    Hoteis
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Melhores Hoteis
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Os hotéis mais bem avaliados para você relaxar e
                              curtir a viagem da melhor forma.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/" title="Pousadas">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsum molestias, eos expedita veniam reiciendis a esse
                      </ListItem>
                      <ListItem href="/" title="Pacotes">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsum molestias, eos expedita veniam reiciendis a esse
                      </ListItem>
                      <ListItem href="/" title="Promoções">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ipsum molestias, eos expedita veniam reiciendis a esse
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        `${color ? "text-black" : "text-white"}`
                      )}
                    >
                      Pacotes para Familia
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        `${color ? "text-black" : "text-white"}`
                      )}
                    >
                      Ajuda
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="navbar-end">
            <HoverCard openDelay={150}>
              <HoverCardTrigger asChild>
                <button className="btn btn-ghost btn-circle hover:bg-gray-200/70 active:bg-gray-200 group">
                  <div
                    className={`indicator ${
                      color ? "text-black" : "text-white"
                    } group-hover:text-black`}
                  >
                    <UserRound />
                  </div>
                </button>
              </HoverCardTrigger>
              <HoverCardContent>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/cadastro"
                      className="text-black font-semibold block p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 transform scale-100"
                    >
                      Cadastre-se
                    </a>
                  </li>
                  <li>
                    <a
                      href="/login"
                      className="text-black font-semibold block p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 transform scale-100"
                    >
                      Login
                    </a>
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>

            <button className="btn btn-ghost btn-circle hover:bg-gray-200/70 active:bg-gray-200 group">
              <div
                className={`indicator ${
                  color ? "text-black" : "text-white"
                } group-hover:text-black`}
              >
                <ShoppingCart />
              </div>
            </button>
          </div>
        </div>
      </motion.header>
      <motion.div
        variants={{
          visible: {
            display: "flex",
            y: -0,
          },
          hidden: {
            display: "none",
            y: -10,
          },
        }}
        initial="hidden"
        animate={searchVisible ? "visible" : "hidden"}
        transition={{ duration: 0.1, ease: "easeIn" }}
        className="fixed w-full z-10 top-16 bg-white shadow-md"
      >
        <div className="max-md:w-full md:w-5/6 max-sm:p-4 lg:w-3/4 mx-auto pb-4">
          <label className="input input-bordered bg-white input-md h-10 flex items-center gap-2 w-3/6 mx-auto rounded-full shadow-lg min-w-64 pr-0">
            <Input
              type="text"
              placeholder="Aonde você quer ir? Hotéis, Pousadas, Cidades..."
              className="grow"
            />
          </label>
        </div>
      </motion.div>
    </>
  );
};
