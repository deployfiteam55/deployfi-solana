import { create } from 'zustand'

const useAppStore = create((set) => ({
  walletAddress: null,
  solBalance: 0,
  launches: [],
  activeYields: [],
  txHistory: [],

  setWallet:   (addr) => set({ walletAddress: addr }),
  setBalance:  (bal)  => set({ solBalance: bal }),
  addLaunch:   (t)    => set((s) => ({ launches: [...s.launches, t] })),
  addYield:    (y)    => set((s) => ({ activeYields: [...s.activeYields, y] })),
  addTx:       (tx)   => set((s) => ({ txHistory: [tx, ...s.txHistory] })),
  clearLaunches: ()   => set({ launches: [] }),
}))

export default useAppStore