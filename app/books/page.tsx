import { redirect } from "next/navigation";

// Keep existing bookmarks useful without a separate library landing page.
export default function Page() {
  redirect("/books/music-theory");
}
