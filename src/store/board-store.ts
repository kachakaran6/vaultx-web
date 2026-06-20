import { create } from "zustand";
import { db } from "../db/schema";
import type { BoardRecord, BoardDraft } from "./types";
import { pushToast } from "./toast-store";
import { applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Node, Edge, Connection, addEdge } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

interface BoardStore {
  boards: BoardRecord[];
  activeBoard: BoardRecord | null;
  loading: boolean;
  
  // Board Gallery
  loadBoards: () => Promise<void>;
  createBoard: (draft: BoardDraft) => Promise<string | null>;
  deleteBoard: (boardId: string) => Promise<void>;
  
  // Active Board
  openBoard: (boardId: string) => Promise<void>;
  closeBoard: () => void;
  updateActiveBoard: (updates: Partial<BoardRecord>) => Promise<void>;
  saveActiveBoard: () => Promise<void>;
  
  // Canvas State (syncs with React Flow)
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
  
  // Custom Board Actions
  addNode: (type: string, position: { x: number, y: number }, data?: any) => void;
  updateNodeData: (id: string, dataUpdate: any) => void;
  
  // Link Picker
  isLinkPickerOpen: boolean;
  openLinkPicker: () => void;
  closeLinkPicker: () => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  boards: [],
  activeBoard: null,
  loading: false,
  nodes: [],
  edges: [],
  isLinkPickerOpen: false,

  openLinkPicker: () => set({ isLinkPickerOpen: true }),
  closeLinkPicker: () => set({ isLinkPickerOpen: false }),

  loadBoards: async () => {
    set({ loading: true });
    const boards = await db.boards.toArray();
    boards.sort((a, b) => b.updatedAt - a.updatedAt);
    set({ boards, loading: false });
  },

  createBoard: async (draft) => {
    const id = uuidv4();
    const newBoard: BoardRecord = {
      id,
      name: draft.name.trim() || "Untitled Board",
      description: draft.description,
      emoji: draft.emoji || "🎨",
      cover: draft.cover,
      background: draft.background,
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await db.boards.put(newBoard);
    await get().loadBoards();
    pushToast({ tone: "success", title: "Board created", description: newBoard.name });
    return id;
  },

  deleteBoard: async (boardId) => {
    await db.boards.delete(boardId);
    await get().loadBoards();
    pushToast({ tone: "danger", title: "Board deleted" });
  },

  openBoard: async (boardId) => {
    set({ loading: true });
    const board = await db.boards.get(boardId);
    if (board) {
      set({ 
        activeBoard: board, 
        nodes: board.nodes || [], 
        edges: board.edges || [],
        loading: false 
      });
    } else {
      set({ loading: false });
      pushToast({ tone: "danger", title: "Board not found" });
    }
  },

  closeBoard: () => {
    set({ activeBoard: null, nodes: [], edges: [] });
  },

  updateActiveBoard: async (updates) => {
    const { activeBoard } = get();
    if (!activeBoard) return;
    
    const updated = { ...activeBoard, ...updates, updatedAt: Date.now() };
    set({ activeBoard: updated });
    await db.boards.put(updated);
    await get().loadBoards();
  },

  saveActiveBoard: async () => {
    const { activeBoard, nodes, edges } = get();
    if (!activeBoard) return;
    
    const updated = { ...activeBoard, nodes, edges, updatedAt: Date.now() };
    set({ activeBoard: updated });
    await db.boards.put(updated);
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
    void get().saveActiveBoard();
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
    void get().saveActiveBoard();
  },

  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } }, get().edges) });
    void get().saveActiveBoard();
  },

  setNodes: (nodes) => {
    set({ nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes });
    void get().saveActiveBoard();
  },

  setEdges: (edges) => {
    set({ edges: typeof edges === 'function' ? edges(get().edges) : edges });
    void get().saveActiveBoard();
  },

  addNode: (type, position, data = {}) => {
    const newNode: Node = {
      id: uuidv4(),
      type,
      position,
      data,
    };
    set({ nodes: [...get().nodes, newNode] });
    void get().saveActiveBoard();
  },

  updateNodeData: (id, dataUpdate) => {
    set({
      nodes: get().nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...dataUpdate } } : n)
    });
    void get().saveActiveBoard();
  }
}));
