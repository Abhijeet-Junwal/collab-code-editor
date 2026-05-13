"use client";

import { ExtendedTreeItemProps } from "@/types/FileSystemTypes";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function findParentId(
  tree: ExtendedTreeItemProps[],
  targetId: string
): string | null {
  for (const node of tree) {
    if (node.children?.some((child) => child.id === targetId)) {
      return node.id;
    }
    const nested = node.children && findParentId(node.children, targetId);
    if (nested) return nested;
  }
  return null;
}

const getFile = async (id: string) => {
  const response = await axios.get(`${BACKEND_URL}/api/file/get/${id}`);
  return response.data;
};

const deleteFile = async (id: string) => {
  const response = await axios.delete(`${BACKEND_URL}/api/file/delete/${id}`);
  return response.data;
};

const renameFile = async (id: string, newName: string) => {
  const response = await axios.put(`${BACKEND_URL}/api/file/rename/${id}`, {
    label: newName,
  });
  return response.data;
};

const saveFile = async (id: string, FileContent: string) => {
  const response = await axios.put(`${BACKEND_URL}/api/file/save/${id}`, {
    FileContent: FileContent,
  });
  return response.data;
};

function ensureIds(tree: any[]): any[] {
  return tree.map((node) => {
    if (!node.id) {
      node.id = `${Date.now()}-${Math.random()}`;
    }
    if (node.children) {
      node.children = ensureIds(node.children);
    }
    return node;
  });
}

const createFile = async (
  roomId: string,
  label: string,
  fileType: string | undefined,
  parentId: string | undefined
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/file/create`,
      {
        id: Date.now().toString(),
        roomId: roomId,
        label: label,
        fileType: fileType,
        parentId: parentId,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export {
  getFile,
  deleteFile,
  renameFile,
  saveFile,
  createFile,
  findParentId,
  ensureIds,
};
