"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

const adminMenuItems = [
  { text: "Посещаемость", href: "/attendance" },
  { text: "Старосты", href: "/admin/headmen" },
  { text: "Подгруппы", href: "/admin/subgroups" },
  { text: "Предметы по выбору", href: "/admin/electives" },
  { text: "Академический отпуск", href: "/admin/academic-leave" },
]

export default function ListItems() {
  const pathname = usePathname()

  return (
    <>
      {adminMenuItems.map((item) => (
        <Link key={item.href} href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
          <ListItemButton selected={pathname === item.href}>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </Link>
      ))}
    </>
  )
}
