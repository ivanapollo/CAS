"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import List from "@mui/material/List"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"

interface MenuItem {
  text: string
  href?: string
  subItems?: MenuItem[]
}

const adminMenuItems: MenuItem[] = [
  { 
    text: "Посещаемость", 
    href: "/attendance" 
  },
  { 
    text: "Управление студентами",
    subItems: [
      { text: "Старосты", href: "/admin/headmen" },
      { text: "Подгруппы", href: "/admin/subgroups" },
      { text: "Предметы по выбору", href: "/admin/electives" },
      { text: "Академический отпуск", href: "/admin/academic-leave" },
    ]
  },
]

export default function ListItems() {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const handleClick = (text: string) => {
    setOpenItems(prev => ({ ...prev, [text]: !prev[text] }))
  }

  return (
    <List component="nav">
      {adminMenuItems.map((item) => (
        <div key={item.text}>
          {item.href ? (
            <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton selected={pathname === item.href}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          ) : (
            <>
              <ListItemButton onClick={() => handleClick(item.text)}>
                <ListItemText primary={item.text} />
                {openItems[item.text] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems?.map((subItem) => (
                    <Link 
                      key={subItem.href} 
                      href={subItem.href ?? ""} 
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListItemButton sx={{ pl: 4 }} selected={pathname === subItem.href}>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </Link>
                  ))}
                </List>
              </Collapse>
            </>
          )}
        </div>
      ))}
    </List>
  )
}
