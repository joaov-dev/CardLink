import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "@/data/store";
import { AppShell } from "@/components/AppShell";
import { Discover } from "@/pages/Discover";
import { ItemDetail } from "@/pages/ItemDetail";
import { Profile } from "@/pages/Profile";
import { AddItem } from "@/pages/AddItem";
import { Messages } from "@/pages/Messages";
import { Conversation } from "@/pages/Conversation";
import { Auth } from "@/pages/Auth";
import { Landing } from "@/pages/Landing";
import { NotFound } from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.querySelector(".shell__main")?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function App() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/entrar" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/entrar" element={<Navigate to="/" replace />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<Discover />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/adicionar" element={<AddItem />} />
          <Route path="/mensagens" element={<Messages />} />
          <Route path="/mensagens/:id" element={<Conversation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
