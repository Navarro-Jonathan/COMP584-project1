import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '584 Project 1',
  description: 'Task management app',
}

export default function RootLayout(props: any) {
  const { children } = props;
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}