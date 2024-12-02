export interface BuildStatus {
  status: 'building' | 'completed' | 'error';
  message?: string;
}

export interface FileStructure {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileStructure[];
}