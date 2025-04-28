import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Scheduro",
  description: "Task and Time Management Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={"antialiased font-poppins"}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
