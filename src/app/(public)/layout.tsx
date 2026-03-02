// import GlobalHeader from "@/components/layout/GlobalHeader";
// import GlobalFooter from "@/components/layout/GlobalFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <GlobalHeader /> */}
      <main className="min-h-screen">{children}</main>
      {/* <GlobalFooter /> */}
    </>
  );
}
