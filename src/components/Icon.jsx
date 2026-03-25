import {
  BookOpen,
  LayoutDashboard,
  Mail,
  Library,
  Briefcase,
  Compass,
  GraduationCap,
  ClipboardList,
  BookMarked,
  CreditCard,
  Building2,
  FileText,
  Bell,
  Folder,
  Link,
} from 'lucide-react'

const icons = {
  BookOpen,
  LayoutDashboard,
  Mail,
  Library,
  Briefcase,
  Compass,
  GraduationCap,
  ClipboardList,
  BookMarked,
  CreditCard,
  Building2,
  FileText,
  Bell,
}

export default function Icon({ name, ...props }) {
  const Component = icons[name] ?? Folder
  return <Component {...props} />
}
