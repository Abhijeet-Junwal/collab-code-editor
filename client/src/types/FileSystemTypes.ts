type FileType =
  | "image"
  | "pdf"
  | "doc"
  | "video"
  | "folder"
  | "pinned"
  | "trash";

export type ExtendedTreeItemProps = {
  parentId?: string;
  fileType?: FileType;
  id: string;
  label: string;
  children?: ExtendedTreeItemProps[];
};

/*
 * ===========================================================================================
 *                              NOTES — FileSystemTypes.ts
 * ===========================================================================================
 *
 * PURPOSE: Defines TypeScript types for a file system/file tree structure used in the UI.
 * ROLE IN ARCHITECTURE: Frontend Types Layer. Shared definitions for file/folder components.
 * 
 * IMPORTS: None.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `FileType` (Type)
 *   - Does: Union type restricting file types to specific known strings (e.g., "image", "folder").
 * - `ExtendedTreeItemProps` (Type)
 *   - Does: Defines the structure of a node in a recursive file tree component.
 *   - Fields:
 *     - `id`, `label` (required strings).
 *     - `parentId` (optional string): Used for flat list to tree conversion.
 *     - `fileType` (optional FileType): Determines icon/behavior.
 *     - `children` (optional Array of itself): Allows recursive tree structures.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Imported wherever the file tree UI is rendered (though currently not heavily utilized in the main editor flows provided so far, likely part of an upcoming or parallel feature).
 * 
 * DESIGN PATTERNS:
 * - Recursive Type Definition: `ExtendedTreeItemProps` references itself in the `children` array to allow infinite nesting of folders/files.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why make `children` optional in `ExtendedTreeItemProps`?
 *    - Answer: A leaf node (like a "file") does not have children. An empty "folder" also might not have children yet. Forcing it to be an empty array wastes memory and requires more boilerplate than just leaving it `undefined`.
 */
