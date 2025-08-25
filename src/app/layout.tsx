import './globals.css'

export const metadata = {
  title: 'Travel Guide - Europa Camping Rundreisen',
  description: 'Spezialisierter Reiseplanungs-Assistent für individuelle Camping-Rundreisen durch Europa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="font-poppins">
      <body className="bg-background text-text antialiased">
        {children}
      </body>
    </html>
  )
}