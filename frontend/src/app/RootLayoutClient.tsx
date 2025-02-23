import Navbar from './components/Navbar';

export default function RootLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
